import { Customer } from '@rize/rize-js/types/lib/core/customer';
import React, { useContext } from 'react';

export type CustomerContextProps = {
    customer?: Customer;
    setCustomer: (customer: Customer) => Promise<void>;
}

export const CustomerContext = React.createContext<CustomerContextProps>({
    customer: undefined,
    setCustomer: () => Promise.resolve(),
});

export interface CustomerProviderProps {
    children?: JSX.Element;
}

export type CustomerProviderState = {
    customer?: Customer;
}

const initialState = {
    customer: undefined,
};

export class CustomerProvider extends React.Component<CustomerProviderProps, CustomerProviderState> {
    constructor(props: CustomerProviderProps) {
        super(props);

        this.state = initialState;
    }

    promisedSetState = async <K extends keyof CustomerProviderState>(
        state: Pick<CustomerProviderState, K> | ((prevState: Readonly<CustomerProviderState>, props: Readonly<CustomerProviderProps>) => (Pick<CustomerProviderState, K> | CustomerProviderState | null)) | null
    ): Promise<void> => {
        return new Promise((resolve) => {
            this.setState(state, () => { resolve(); });
        });
    }

    setCustomer = async (customer: Customer): Promise<void> => {
        await this.promisedSetState({ customer });
    }

    render(): JSX.Element {
        const { customer } = this.state;

        return (
            <CustomerContext.Provider
                value={{
                    customer: customer,
                    setCustomer: this.setCustomer
                }}
            >
                {this.props.children}
            </CustomerContext.Provider>
        );
    }
}

export const CustomerConsumer = CustomerContext.Consumer;

export const useCustomer = (): CustomerContextProps => useContext(CustomerContext);