import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { ComplianceWorkflow } from '@rizefinance/rize-js/types/lib/core/compliance-workflow';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
import { RootStackParamList } from '../types';
import {CustomerService, ProductService, ComplianceWorkflowService} from '../services';
import config from '../config/config';
import { find, isNil } from 'lodash';
import { useAuth } from '../contexts';
import * as Network from 'expo-network';

export const ComplianceContext = createContext({} as ComplianceProps);

const ComplianceProvider = ({ navigation, children }: IComplianceProvider) => {
  const [complianceWorkflow, setComplianceWorkflow] = useState<any>(undefined);
  const [productAgreements, setProductAgreements] = useState<ProductAgreements[]>([]);
  const [customerWorkflows, setCustomerWorkflows] = useState<ComplianceWorkflow[]>([]);

  const [totalSteps, setTotalSteps] = useState(1)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined)

  const { accessToken, customer, setCustomer } = useAuth();
  console.log(complianceWorkflow, 'complianceWorkflow');

console.log(customer, 'customer')
 

  const redirectToProductStep = async () => {
    const brokerageProductUid = config.application.brokerageProductUid;

    let currentScreen: keyof RootStackParamList = 'ProfileQuestions';

    const routeParams = {
      productType: ProductType.Brokerage,
      productId: brokerageProductUid,
    };

    const { data: products } = await ProductService.getProducts(accessToken);

    console.log(products, 'products');

    const brokerageProduct = find(products, { uid: brokerageProductUid });

    console.log(brokerageProduct, 'brokerageProduct');

    if (brokerageProduct.profile_requirements.length >= 1) {
      currentScreen = 'ProfileQuestions';
    }

    const steps: (keyof RootStackParamList)[] = ['ProfileQuestions', 'BrokerageDisclosures'];

    if (currentScreen && steps.includes(currentScreen)) {
      for (const step of steps) {
        navigation.navigate(step, routeParams);

        if (step === currentScreen) {
          break;
        }
      }
    }
  };

  const loadAgreements = async (): Promise<void> => {
    setProductAgreements((prev) => ({
      ...prev,
      loadingAgreements: true,
    }));

    try {
      const { data: customerProducts } = await CustomerService.getCustomerProducts(
        accessToken,
        customer.uid
      );
      const workflows = await ComplianceWorkflowService.getComplianceWorkflows(
        accessToken,
        customer.uid
      );

      const ourAgreements = workflows.data.map((workflow, i) => {
        return {
          productName:
            customerProducts && customerProducts[i] ? customerProducts[i].product_name : '',
          agreements: workflow ? workflow.accepted_documents : [],
        };
      }) as ProductAgreements[];
      setProductAgreements((prev) => ({ ...prev, agreements: ourAgreements }));
    } catch (err) {
      throw new Error(err);
    } finally {
      setProductAgreements((prev) => ({
        ...prev,
        loadingAgreements: false,
      }));
    }
  };

  const loadComplianceWorkflows = async (query: any = {}): Promise<any> => {
    try {
      const { data: customerWorkflows } = await ComplianceWorkflowService.getCustomerWorkflows(
        accessToken,
        query
      );
      setCustomerWorkflows(customerWorkflows);
      return { data: customerWorkflows };
    } catch (err) {
      return { data: err };
    }
  };


  const evaluateCurrentStep = async () => {
    if (customer?.status === 'initiated') {
      if (complianceWorkflow.summary.status === 'expired') {
        // await renewComplianceWorkflow();
      } else {
        const acceptedDisclosures = complianceWorkflow.accepted_documents.filter(
          (x) => x.step === 1
        );
        const pendingDisclosures = complianceWorkflow.current_step_documents_pending.filter(
          (x) => x.step === 1
        );
        const allDisclosures = complianceWorkflow.all_documents
          .filter((x) => x.step === 1)
          .map((x) => {
            const acceptedTerm = acceptedDisclosures.find((acc) => acc.name === x.name);
            const pendingTerm = pendingDisclosures.find((acc) => acc.name === x.name);

            return {
              ...x,
              selected: !!acceptedTerm,
              uid: acceptedTerm?.uid ?? pendingTerm.uid,
              alreadyAccepted: !!acceptedTerm,
            } as ComplianceDocumentSelection;
          });

      }

      // redirectToCurrentStep();
    }
  };


  useEffect(() => {
    const getWorkflow = async () => {
      try {
        const latestWorkflow = await ComplianceWorkflowService.viewLatestWorkflow(accessToken);
        // NOTE: NEED THIS?
        setComplianceWorkflow(latestWorkflow);
        console.log(latestWorkflow, 'latestWorkflow');

        let steps = 0;

        latestWorkflow.all_documents.forEach((doc) => {
          if (doc.step > steps) {
            steps = doc.step;
          }
        });

        setTotalSteps(steps)



        if (latestWorkflow.summary.status === 'expired') {
          const data = await ComplianceWorkflowService.createWorkflow({
            accessToken,
            customerUid: customer.uid,
            productCompliancePlanUid: latestWorkflow.product_compliance_plan_uid,
          });
        }

        // const parsedWorkflow = parseWorkflow(latestWorkflow);

        // setComplianceWorkflow(parsedWorkflow);
      } catch (err) {
        console.log(err, 'err');
      }
    };
    getWorkflow();
  }, []);

  const submitAgreements = async (values, actions) => {
    setLoading(true)
    const ip_address = await Network.getIpAddressAsync();

    const documents = Object.keys(values).map((document_uid) => {
      return {
        accept: 'yes',
        document_uid,
        ip_address,
        user_name: complianceWorkflow.customer.email,
      };
    });

    try {
      const updatedComplianceWorkflow = await ComplianceWorkflowService.acknowledgeDocuments(
        accessToken,
        documents
      );
      setComplianceWorkflow(updatedComplianceWorkflow);

      setLoading(false);
      actions.resetForm()
    } catch (err) {
      setError(err);
      setLoading(false);

    }
  };


  const value = useMemo(
    () => ({
      complianceWorkflow,
      customerWorkflows,
      productAgreements,
      evaluateCurrentStep,
      setComplianceWorkflow,
      loadAgreements,
      loadComplianceWorkflows,
      totalSteps,
      submitAgreements,
    }),
    [
      complianceWorkflow,
      customerWorkflows,
      productAgreements,
      evaluateCurrentStep,
      setComplianceWorkflow,
      loadAgreements,
      loadComplianceWorkflows,
      totalSteps,
      submitAgreements
    ]
  );

  return <ComplianceContext.Provider value={value}>{children}</ComplianceContext.Provider>;
};

const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};

export { ComplianceProvider, useCompliance };

interface IComplanceWorkflowQuery {
  product_uid?: string[];
  in_progress?: boolean;
  limit?: number;
  offset?: number;
}

export enum ProductType {
  Checking = 'checking',
  Brokerage = 'brokerage',
}

export type ComplianceDocumentSelection = ComplianceDocument & {
  selected?: boolean;
  alreadyAccepted: boolean;
};

export interface ProductAgreements {
  productName: string;
  agreements: ComplianceDocumentSelection[];
}

export type ComplianceProps = {
  complianceWorkflow?: ComplianceWorkflow;
  productAgreements: ProductAgreements[];
  customerWorkflows?: ComplianceWorkflow[];
  setComplianceWorkflow: Dispatch<SetStateAction<ComplianceWorkflow>>;
  setDisclosures: Dispatch<SetStateAction<ComplianceDocumentSelection[]>>;
  evaluateCurrentStep: () => Promise<void>;
  loadAgreements: () => Promise<void>;
  loadComplianceWorkflows: (query: IComplanceWorkflowQuery) => Promise<void>;
};

export interface IComplianceProvider {
  children?: JSX.Element;
  navigation: StackNavigationProp<RootStackParamList>;
}

export type ComplianceWorkflowProviderState = {
  complianceWorkflow?: ComplianceWorkflow;
  productAgreements: ProductAgreements[];
  customerWorkflows?: ComplianceWorkflow[];
};
