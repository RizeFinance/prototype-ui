import { ComplianceWorkflow } from '@rize/rize-js/types/lib/core/compliance-workflow';
import React, { useContext } from 'react';

export type ComplianceWorkflowContextProps = {
    complianceWorkflow?: ComplianceWorkflow;
    setComplianceWorkflow: (complianceWorkflow: ComplianceWorkflow) => Promise<void>;
}

export const ComplianceWorkflowContext = React.createContext<ComplianceWorkflowContextProps>({
    complianceWorkflow: undefined,
    setComplianceWorkflow: () => Promise.resolve(),
});

export interface ComplianceWorkflowProviderProps {
    children?: JSX.Element;
}

export type ComplianceWorkflowProviderState = {
    complianceWorkflow?: ComplianceWorkflow;
}

const initialState = {
    complianceWorkflow: undefined,
};

export class ComplianceWorkflowProvider extends React.Component<ComplianceWorkflowProviderProps, ComplianceWorkflowProviderState> {
    constructor(props: ComplianceWorkflowProviderProps) {
        super(props);

        this.state = initialState;
    }

    promisedSetState = async <K extends keyof ComplianceWorkflowProviderState>(
        state: Pick<ComplianceWorkflowProviderState, K> | ((prevState: Readonly<ComplianceWorkflowProviderState>, props: Readonly<ComplianceWorkflowProviderProps>) => (Pick<ComplianceWorkflowProviderState, K> | ComplianceWorkflowProviderState | null)) | null
    ): Promise<void> => {
        return new Promise((resolve) => {
            this.setState(state, () => { resolve(); });
        });
    }

    setComplianceWorkflow = async (complianceWorkflow: ComplianceWorkflow): Promise<void> => {
        await this.promisedSetState({ complianceWorkflow });
    }

    render(): JSX.Element {
        const { complianceWorkflow } = this.state;

        return (
            <ComplianceWorkflowContext.Provider
                value={{
                    complianceWorkflow: complianceWorkflow,
                    setComplianceWorkflow: this.setComplianceWorkflow
                }}
            >
                {this.props.children}
            </ComplianceWorkflowContext.Provider>
        );
    }
}

export const ComplianceWorkflowConsumer = ComplianceWorkflowContext.Consumer;

export const useComplianceWorkflow = (): ComplianceWorkflowContextProps => useContext(ComplianceWorkflowContext);