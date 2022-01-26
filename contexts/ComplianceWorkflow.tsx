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
import { Customer } from '../models';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
import { RootStackParamList } from '../types';
import ComplianceWorkflowService from '../services/ComplianceWorkflowService';
import CustomerService from '../services/CustomerService';
import { ProductService } from '../services';
import config from '../config/config';
import { find, isNil } from 'lodash';
import { useAuth } from '../contexts';

/*TODO
 * 1. Convert to func component
 * 2. Figure out page flow control
 * 3. Based on steps
 */

export const ComplianceContext = createContext({} as ComplianceProps);

const ComplianceProvider = ({ navigation, children }: IComplianceProvider) => {
  const [complianceWorkflow, setComplianceWorkflow] = useState<ComplianceWorkflow | undefined>(
    undefined
  );
  const [productAgreements, setProductAgreements] = useState<ProductAgreements[]>([]);
  const [customerWorkflows, setCustomerWorkflows] = useState<ComplianceWorkflow[]>([]);
  const [disclosures, setDisclosures] = useState<ComplianceDocumentSelection[]>([]);
  const [bankingDisclosures, setBankingDisclosures] = useState<ComplianceDocumentSelection[]>([]);

  const { accessToken, customer, setCustomer } = useAuth();

  console.log(customer, 'customer');
  console.log(complianceWorkflow, 'complianceWorkflow');


  const redirectToCurrentStep = () => {
    // loadDisclosures();
    let currentScreen: keyof RootStackParamList = 'Disclosures';
    let routeParams = {};

    if (complianceWorkflow.summary.current_step === 1) {
      currentScreen = 'Disclosures';
    } else if (complianceWorkflow.summary.current_step === 2) {
      // Check if Patriot Act is not yet acknowledged
      const isPatriotActAcknowledged = !!complianceWorkflow.accepted_documents.find(
        (x) => x.external_storage_name === 'usa_ptrt_0'
      );

      if (!isPatriotActAcknowledged) {
        currentScreen = 'PatriotAct';
      } else {
        // Check if there are no customer details yet
        if (!customer.details?.first_name) {
          currentScreen = 'PII';
        } else {
          currentScreen = 'BankingDisclosures';
        }
      }
    }

    if (customer.status === 'active') {
      currentScreen = 'ConfirmPII';
      routeParams = { hasChanged: false };
    }

    const steps: (keyof RootStackParamList)[] = [
      'Disclosures',
      'PatriotAct',
      'PII',
      'BankingDisclosures',
      'ConfirmPII',
    ];

    if (currentScreen && steps.includes(currentScreen)) {
      for (const step of steps) {
        navigation.navigate(step, routeParams);

        if (step === currentScreen) {
          break;
        }
      }
    }
  };

  const renewComplianceWorkflow = async () => {
    const newComplianceWorkflow = await ComplianceWorkflowService.renewWorkflow(accessToken);
    const customer = await CustomerService.getCustomer(accessToken);

    setComplianceWorkflow(newComplianceWorkflow);
    setCustomer(customer);
  };

  const redirectToProductStep = async () => {
    const brokerageProductUid = config.application.brokerageProductUid;

    let currentScreen: keyof RootStackParamList = 'ProfileQuestions';

    const routeParams = {
      productType: ProductType.Brokerage,
      productId: brokerageProductUid,
    };

    const { data: products } = await ProductService.getProducts(accessToken);

    const brokerageProduct = find(products, { uid: brokerageProductUid });

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

  const loadBankingDisclosures = async (): Promise<void> => {
    if (complianceWorkflow === undefined) return;
    const {
      all_documents: all,
      accepted_documents: accepted,
      current_step_documents_pending: pending,
    } = complianceWorkflow;

    const acceptedBankingDisclosures = accepted.filter(
      (x) => x.name === 'Deposit Agreement and Disclosures'
    );
    const pendingBankingDisclosures = pending.filter(
      (x) => x.name === 'Deposit Agreement and Disclosures'
    );
    const allDisclosures = all
      .filter((x) => x.name === 'Deposit Agreement and Disclosures')
      .map((x) => {
        const acceptedBankingDisc = acceptedBankingDisclosures.find((acc) => acc.name === x.name);
        const pendingBankingDisc = pendingBankingDisclosures.find((acc) => acc.name === x.name);

        return {
          ...x,
          selected: !!acceptedBankingDisc,
          uid: acceptedBankingDisc?.uid ?? pendingBankingDisc.uid,
          alreadyAccepted: !!acceptedBankingDisc,
        } as ComplianceDocumentSelection;
      });

    setBankingDisclosures(allDisclosures);
  };

  const createComplianceWorkflow = async (productUid: string): Promise<ComplianceWorkflow> => {
    const newComplianceWorkflow = await ComplianceWorkflowService.createWorkflow(
      accessToken,
      productUid
    );

    setComplianceWorkflow(newComplianceWorkflow);
    return newComplianceWorkflow;
  };

  const evaluateCurrentStep = async () => {
  

    if (customer?.status === 'initiated') {

      if (complianceWorkflow.summary.status === 'expired') {
        await renewComplianceWorkflow();
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

          console.log(allDisclosures, 'allDisclosures');
          
        setDisclosures(allDisclosures);
      }

      // redirectToCurrentStep();
    }
  }

  useEffect(() => {
    const goToProductStep = async () => {
      await redirectToProductStep();
    }
    if(customer.status === 'active' && complianceWorkflow) {
      goToProductStep()
    }
  }, [customer, complianceWorkflow])

  useEffect(() => {
    const getRecentWorkflow = async () => {
      try {
        const pendingDisclosures = complianceWorkflow.current_step_documents_pending.filter(
          (doc) => doc.step === 1
        );
        const acceptedDisclosures = complianceWorkflow.accepted_documents.filter(
          (doc) => doc.step === 1
        );
       
        const allDisclosures = complianceWorkflow.all_documents
          .filter((doc) => doc.step === 1)
          .map((doc) => {
            const acceptedTerm = acceptedDisclosures.find((acc) => acc.name === doc.name);
            const pendingTerm = pendingDisclosures.find((acc) => acc.name === doc.name);

            return {
              ...doc,
              selected: !!acceptedTerm,
              uid: acceptedTerm?.uid ?? pendingTerm.uid,
              alreadyAccepted: !!acceptedTerm,
            } as ComplianceDocumentSelection;
          });

        setDisclosures(allDisclosures);
      } catch(error) {
        console.log(error);
        
      }
    }
    if(customer.status === 'initiated') {
      getRecentWorkflow()
    }
  }, [customer, complianceWorkflow])

  useEffect(() => {
    const getWorkflow = async () => {
      const latestWorkflow = await ComplianceWorkflowService.viewLatestWorkflow(accessToken);
      setComplianceWorkflow(latestWorkflow)
    }
    getWorkflow()
  }, [])

  const value = useMemo(
    () => ({
      complianceWorkflow,
      customerWorkflows,
      disclosures,
      productAgreements,
      bankingDisclosures,
      evaluateCurrentStep,
      setComplianceWorkflow,
      setDisclosures,
      setBankingDisclosures,
      loadBankingDisclosures,
      loadAgreements,
      loadComplianceWorkflows,
      createComplianceWorkflow,
    }),
    [
      complianceWorkflow,
      customerWorkflows,
      disclosures,
      productAgreements,
      bankingDisclosures,
      evaluateCurrentStep,
      setComplianceWorkflow,
      setDisclosures,
      setBankingDisclosures,
      loadBankingDisclosures,
      loadAgreements,
      loadComplianceWorkflows,
      createComplianceWorkflow,
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
  disclosures: ComplianceDocumentSelection[];
  bankingDisclosures: ComplianceDocumentSelection[];
  setComplianceWorkflow: Dispatch<SetStateAction<ComplianceWorkflow>>;
  setDisclosures: Dispatch<SetStateAction<ComplianceDocumentSelection[]>>;
  setBankingDisclosures: Dispatch<SetStateAction<ComplianceDocumentSelection[]>>;
  evaluateCurrentStep: () => Promise<void>;
  loadBankingDisclosures: () => Promise<void>;
  loadAgreements: () => Promise<void>;
  loadComplianceWorkflows: (query: IComplanceWorkflowQuery) => Promise<void>;
  createComplianceWorkflow: (product_uid: string) => Promise<any>;
};

export interface IComplianceProvider {
  children?: JSX.Element;
  navigation: StackNavigationProp<RootStackParamList>;
}

export type ComplianceWorkflowProviderState = {
  complianceWorkflow?: ComplianceWorkflow;
  productAgreements: ProductAgreements[];
  customerWorkflows?: ComplianceWorkflow[];
  disclosures: ComplianceDocumentSelection[];
  bankingDisclosures: ComplianceDocumentSelection[];
};
