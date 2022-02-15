import { StackNavigationProp } from '@react-navigation/stack';
import { ComplianceWorkflow } from '@rizefinance/rize-js/types/lib/core/compliance-workflow';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
import { Product } from '@rizefinance/rize-js/types/lib/core/typedefs/product.typedefs';
import React, { useContext } from 'react';
import { RootStackParamList } from '../types';
import { AuthContext } from './Auth';
import { AuthContextProps } from '../contexts/Auth';
import BrokerageWorkflowService from '../services/ComplianceWorkflowService';
import { ProductService } from '../services';
import config from '../config/config';
import { find } from 'lodash';

export type ComplianceDocumentSelection = ComplianceDocument & {
  selected?: boolean;
  alreadyAccepted: boolean;
};

export const BrokerageProductType = 'brokerage';

export type BrokerageWorkflowContextProps = {
  brokerageWorkflow?: ComplianceWorkflow;
  customerWorkflows?: ComplianceWorkflow[];
  disclosures: ComplianceDocumentSelection[];
  bankingDisclosures: ComplianceDocumentSelection[];
  setBrokerageWorkflow: (brokerageWorkflow: ComplianceWorkflow) => Promise<void>;
  setDisclosures: (disclosures: ComplianceDocumentSelection[]) => Promise<void>;
  setBankingDisclosures: (disclosures: ComplianceDocumentSelection[]) => Promise<void>;
  findOrCreateBrokerageWorkflow: () => Promise<void>;
  evaluateCurrentStep: () => Promise<void>;
  loadBrokerageWorkflows: (query: IComplanceWorkflowQuery) => Promise<void>;
  createBrokerageWorkflow: (product_uid: string) => Promise<any>;
};

export const BrokerageWorkflowContext = React.createContext<BrokerageWorkflowContextProps>({
  brokerageWorkflow: undefined,
  customerWorkflows: [],
  disclosures: [],
  bankingDisclosures: [],
  setBrokerageWorkflow: () => Promise.resolve(),
  setDisclosures: () => Promise.resolve(),
  setBankingDisclosures: () => Promise.resolve(),
  findOrCreateBrokerageWorkflow: () => Promise.resolve(),
  evaluateCurrentStep: () => Promise.resolve(),
  loadBrokerageWorkflows: () => Promise.resolve(),
  createBrokerageWorkflow: () => Promise.resolve(),
});

export interface BrokerageWorkflowProviderProps {
  children?: JSX.Element;
  navigation: StackNavigationProp<RootStackParamList>;
  auth: AuthContextProps;
}

export type BrokerageWorkflowProviderState = {
  brokerageProductUid: string;
  customerWorkflows?: ComplianceWorkflow[];
  brokerageWorkflow?: ComplianceWorkflow;
  brokerageProduct?: Product;
  disclosures: ComplianceDocumentSelection[];
  bankingDisclosures: ComplianceDocumentSelection[];
};

const initialState = {
  brokerageProductUid: config.application.brokerageProductUid,
  customerWorkflows: [],
  brokerageWorkflow: undefined,
  brokerageProduct: undefined,
  disclosures: [],
  bankingDisclosures: [],
};

export class BrokerageWorkflowProvider extends React.Component<
  BrokerageWorkflowProviderProps,
  BrokerageWorkflowProviderState
> {
  static contextType = AuthContext;
  context: React.ContextType<typeof AuthContext>;
  constructor(props: BrokerageWorkflowProviderProps) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount(): Promise<void> {
    await this.loadBrokerageProduct();
    await this.refreshWorkflow();
  }

  findOrCreateBrokerageWorkflow = async (): Promise<void> => {
    const navigation = this.props.navigation;
    const productUid = this.state.brokerageProductUid;

    const { data: workflows } = await BrokerageWorkflowService.getCustomerWorkflows(
      this.context.accessToken,
      { product_uid: [productUid] }
    );

    const activeWorkflow = find(workflows, { summary: { status: 'in_progress' } });

    if (activeWorkflow) {
      await this.setBrokerageWorkflow(activeWorkflow);
    } else {
      await this.createBrokerageWorkflow(productUid);
    }

    navigation.navigate('BrokerageOverview');
  };

  refreshWorkflow = async (): Promise<void> => {
    const productUid = this.state.brokerageProductUid;

    const { data: workflows } = await BrokerageWorkflowService.getCustomerWorkflows(
      this.context.accessToken,
      { product_uid: [productUid] }
    );

    const activeWorkflow = find(workflows, { summary: { status: 'in_progress' } });

    if (activeWorkflow) {
      await this.setBrokerageWorkflow(activeWorkflow);
    }
  };

  evaluateCurrentStep = async (): Promise<void> => {
    const navigation = this.props.navigation;
    const workflow = this.state.brokerageWorkflow;

    if (!workflow) {
      await this.findOrCreateBrokerageWorkflow();
    }

    if (!workflow) {
      return;
    }

    switch (workflow.summary.current_step) {
      case 1:
        navigation.navigate('BrokerageProductQuestions');
        break;
    }
  };

  loadBrokerageProduct = async (): Promise<void> => {
    const productUid = this.state.brokerageProductUid;
    const product = await ProductService.getProduct(this.context.accessToken, productUid);

    this.setBrokerageProduct(product);
  };

  loadBrokerageWorkflows = async (query: any = {}): Promise<void> => {
    try {
      const { data: customerWorkflows } = await BrokerageWorkflowService.getCustomerWorkflows(
        this.context.accessToken,
        query
      );
      this.setState({ customerWorkflows });
      return { data: customerWorkflows };
    } catch (err) {
      return { data: err };
    }
  };

  createBrokerageWorkflow = async (productUid: string): Promise<ComplianceWorkflow> => {
    const newBrokerageWorkflow = await BrokerageWorkflowService.createWorkflow(
      this.context.accessToken,
      productUid
    );

    await this.setBrokerageWorkflow(newBrokerageWorkflow);
    return newBrokerageWorkflow;
  };

  promisedSetState = async <K extends keyof BrokerageWorkflowProviderState>(
    state:
      | Pick<BrokerageWorkflowProviderState, K>
      | ((
          prevState: Readonly<BrokerageWorkflowProviderState>,
          props: Readonly<BrokerageWorkflowProviderProps>
        ) => Pick<BrokerageWorkflowProviderState, K> | BrokerageWorkflowProviderState | null)
      | null
  ): Promise<void> => {
    return new Promise((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  };

  setBrokerageWorkflow = async (brokerageWorkflow: ComplianceWorkflow): Promise<void> => {
    await this.promisedSetState({ brokerageWorkflow });
  };

  setBrokerageProduct = async (product: Product): Promise<void> => {
    await this.promisedSetState({ brokerageProduct: product });
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
      brokerageWorkflow,
      customerWorkflows,
      brokerageProduct,
      disclosures,
      bankingDisclosures,
    } = this.state;

    return (
      <BrokerageWorkflowContext.Provider
        value={{
          brokerageWorkflow: brokerageWorkflow,
          customerWorkflows: customerWorkflows,
          disclosures: disclosures,
          bankingDisclosures: bankingDisclosures,
          brokerageProduct: brokerageProduct,
          findOrCreateBrokerageWorkflow: this.findOrCreateBrokerageWorkflow,
          evaluateCurrentStep: this.evaluateCurrentStep,
          setBrokerageWorkflow: this.setBrokerageWorkflow,
          setDisclosures: this.setDisclosures,
          setBankingDisclosures: this.setBankingDisclosures,
          loadBrokerageWorkflows: this.loadBrokerageWorkflows,
          createBrokerageWorkflow: this.createBrokerageWorkflow,
        }}
      >
        {this.props.children}
      </BrokerageWorkflowContext.Provider>
    );
  }
}

export const BrokerageWorkflowConsumer = BrokerageWorkflowContext.Consumer;

export const useBrokerageWorkflow = (): BrokerageWorkflowContextProps =>
  useContext(BrokerageWorkflowContext);
