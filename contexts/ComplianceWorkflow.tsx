import { StackNavigationProp } from '@react-navigation/stack';
import { ComplianceWorkflow } from '@rizefinance/rize-js/types/lib/core/compliance-workflow';
import { Customer } from '../models';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
import React, { useContext } from 'react';
import { RootStackParamList } from '../types';
import { AuthContext } from './Auth';
import { AuthContextProps } from '../contexts/Auth';
import ComplianceWorkflowService from '../services/ComplianceWorkflowService';
import CustomerService from '../services/CustomerService';
import ProductService from '../services/ProductService';
import config from '../config/config';
import { find } from 'lodash';

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

export type ComplianceWorkflowContextProps = {
  complianceWorkflow?: ComplianceWorkflow;
  productAgreements: ProductAgreements[];
  customerWorkflows?: ComplianceWorkflow[];
  disclosures: ComplianceDocumentSelection[];
  bankingDisclosures: ComplianceDocumentSelection[];
  setComplianceWorkflow: (complianceWorkflow: ComplianceWorkflow) => Promise<void>;
  setDisclosures: (disclosures: ComplianceDocumentSelection[]) => Promise<void>;
  setBankingDisclosures: (disclosures: ComplianceDocumentSelection[]) => Promise<void>;
  evaluateCurrentStep: () => Promise<void>;
  loadBankingDisclosures: () => Promise<void>;
  loadAgreements: () => Promise<void>;
  loadComplianceWorkflows: (query: IComplanceWorkflowQuery) => Promise<void>;
  createComplianceWorkflow: (product_uid: string) => Promise<void>;
};

export const ComplianceWorkflowContext = React.createContext<ComplianceWorkflowContextProps>({
  complianceWorkflow: undefined,
  productAgreements: [],
  customerWorkflows: [],
  disclosures: [],
  bankingDisclosures: [],
  setComplianceWorkflow: () => Promise.resolve(),
  setDisclosures: () => Promise.resolve(),
  setBankingDisclosures: () => Promise.resolve(),
  evaluateCurrentStep: () => Promise.resolve(),
  loadBankingDisclosures: () => Promise.resolve(),
  loadAgreements: () => Promise.resolve(),
  loadComplianceWorkflows: () => Promise.resolve(),
  createComplianceWorkflow: () => Promise.resolve(),
});

export interface ComplianceWorkflowProviderProps {
  children?: JSX.Element;
  navigation: StackNavigationProp<RootStackParamList>;
  auth: AuthContextProps;
}

export type ComplianceWorkflowProviderState = {
  complianceWorkflow?: ComplianceWorkflow;
  productAgreements: ProductAgreements[];
  customerWorkflows?: ComplianceWorkflow[];
  disclosures: ComplianceDocumentSelection[];
  bankingDisclosures: ComplianceDocumentSelection[];
};

const initialState = {
  complianceWorkflow: undefined,
  productAgreements: [],
  customerWorkflows: [],
  disclosures: [],
  bankingDisclosures: [],
};

export class ComplianceWorkflowProvider extends React.Component<
  ComplianceWorkflowProviderProps,
  ComplianceWorkflowProviderState
> {
  static contextType = AuthContext;
  context: React.ContextType<typeof AuthContext>;
  constructor(props: ComplianceWorkflowProviderProps) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount(): Promise<void> {
    await this.evaluateCurrentStep();
  }

  evaluateCurrentStep = async (): Promise<void> => {
    const customer = this.context.customer;
    const workflow = this.state.complianceWorkflow;

    if (customer?.status === 'active' && workflow) {
      await this.redirectToProductStep(workflow, customer);
    }

    if (customer?.status === 'initiated') {
      // Get the latest workflow of the customer
      const latestWorkflow = await ComplianceWorkflowService.viewLatestWorkflow(
        this.props.auth.accessToken
      );

      if (latestWorkflow.summary.status === 'expired') {
        await this.renewComplianceWorkflow();
      } else {
        await this.setComplianceWorkflow(latestWorkflow);
      }

      await this.redirectToCurrentStep(latestWorkflow, customer);
    }
  };

  loadAgreements = async (): Promise<void> => {
    const customer = this.context.customer;
    this.setState((prevState) => {
      return { ...prevState, loadingAgreements: true };
    });
    try {
      const { data: customerProducts } = await CustomerService.getCustomerProducts(
        this.props.auth.accessToken,
        customer.uid
      );
      const workflows = await ComplianceWorkflowService.getComplianceWorkflows(
        this.props.auth.accessToken,
        customer.uid
      );
      const ourAgreements = workflows.data.map((workflow, i) => {
        return {
          productName:
            customerProducts && customerProducts[i] ? customerProducts[i].product_name : '',
          agreements: workflow ? workflow.accepted_documents : [],
        };
      }) as ProductAgreements[];
      this.setState({ productAgreements: ourAgreements });
    } catch (err) {
      throw new Error(err);
    } finally {
      this.setState((prevState) => {
        return { ...prevState, loadingAgreements: false };
      });
    }
  };

  loadComplianceWorkflows = async (query: any = {}): Promise<void> => {
    try {
      const { data: customerWorkflows } = await ComplianceWorkflowService.getCustomerWorkflows(
        this.props.auth.accessToken,
        query
      );
      this.setState({ customerWorkflows });
      return { data: customerWorkflows };
    } catch (err) {
      return { data: err };
    }
  };

  loadDisclosures = async (): Promise<void> => {
    const {
      all_documents: all,
      accepted_documents: accepted,
      current_step_documents_pending: pending,
    } = await this.state.complianceWorkflow;

    const acceptedDisclosures = accepted.filter((x) => x.step === 1);
    const pendingDisclosures = pending.filter((x) => x.step === 1);
    const allDisclosures = all
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

    await this.promisedSetState({ disclosures: allDisclosures });
  };

  loadBankingDisclosures = async (): Promise<void> => {
    if (this.state.complianceWorkflow === undefined) return;
    const {
      all_documents: all,
      accepted_documents: accepted,
      current_step_documents_pending: pending,
    } = await this.state.complianceWorkflow;

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

    await this.promisedSetState({ bankingDisclosures: allDisclosures });
  };

  redirectToProductStep = async (): Promise<void> => {
    const brokerageProductUid = config.application.brokerageProductUid;
    const navigation = this.props.navigation;

    let currentScreen: keyof RootStackParamList = 'ProfileQuestions';
    const routeParams = {
      productType: ProductType.Brokerage,
      productId: brokerageProductUid,
    };

    const { data: products } = await ProductService.getProducts(this.props.auth.accessToken);

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

  redirectToCurrentStep = async (
    workflow: ComplianceWorkflow,
    customer: Customer
  ): Promise<void> => {
    const navigation = this.props.navigation;

    await this.loadDisclosures();

    let currentScreen: keyof RootStackParamList = 'Disclosures';
    let routeParams = {};

    if (workflow.summary.current_step === 1) {
      currentScreen = 'Disclosures';
    } else if (workflow.summary.current_step === 2) {
      // Check if Patriot Act is not yet acknowledged
      const isPatriotActAcknowledged = !!workflow.accepted_documents.find(
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

  createComplianceWorkflow = async (productUid: string): Promise<ComplianceWorkflow> => {
    const newComplianceWorkflow = await ComplianceWorkflowService.createWorkflow(
      this.props.auth.accessToken,
      productUid
    );

    await this.setComplianceWorkflow(newComplianceWorkflow);
    return newComplianceWorkflow;
  };

  renewComplianceWorkflow = async (): Promise<void> => {
    const newComplianceWorkflow = await ComplianceWorkflowService.renewWorkflow(
      this.props.auth.accessToken
    );
    const customer = await CustomerService.getCustomer(this.props.auth.accessToken);

    await this.setComplianceWorkflow(newComplianceWorkflow);
    await this.context.setCustomer(customer);
  };

  promisedSetState = async <K extends keyof ComplianceWorkflowProviderState>(
    state:
      | Pick<ComplianceWorkflowProviderState, K>
      | ((
          prevState: Readonly<ComplianceWorkflowProviderState>,
          props: Readonly<ComplianceWorkflowProviderProps>
        ) => Pick<ComplianceWorkflowProviderState, K> | ComplianceWorkflowProviderState | null)
      | null
  ): Promise<void> => {
    return new Promise((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  };

  setComplianceWorkflow = async (complianceWorkflow: ComplianceWorkflow): Promise<void> => {
    await this.promisedSetState({ complianceWorkflow });
  };

  setDisclosures = async (disclosures: ComplianceDocumentSelection[]): Promise<void> => {
    await this.promisedSetState({ disclosures });
  };

  setBankingDisclosures = async (
    bankingDisclosures: ComplianceDocumentSelection[]
  ): Promise<void> => {
    await this.promisedSetState({ bankingDisclosures });
  };

  render(): JSX.Element {
    const {
      complianceWorkflow,
      customerWorkflows,
      disclosures,
      productAgreements,
      bankingDisclosures,
    } = this.state;

    return (
      <ComplianceWorkflowContext.Provider
        value={{
          complianceWorkflow: complianceWorkflow,
          customerWorkflows: customerWorkflows,
          disclosures: disclosures,
          productAgreements: productAgreements,
          bankingDisclosures: bankingDisclosures,
          evaluateCurrentStep: this.evaluateCurrentStep,
          setComplianceWorkflow: this.setComplianceWorkflow,
          setDisclosures: this.setDisclosures,
          setBankingDisclosures: this.setBankingDisclosures,
          loadBankingDisclosures: this.loadBankingDisclosures,
          loadAgreements: this.loadAgreements,
          loadComplianceWorkflows: this.loadComplianceWorkflows,
          createComplianceWorkflow: this.createComplianceWorkflow,
        }}
      >
        {this.props.children}
      </ComplianceWorkflowContext.Provider>
    );
  }
}

export const ComplianceWorkflowConsumer = ComplianceWorkflowContext.Consumer;

export const useComplianceWorkflow = (): ComplianceWorkflowContextProps =>
  useContext(ComplianceWorkflowContext);
