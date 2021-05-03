import React, { useContext } from 'react';
import { Customer } from '../models';
import CustomerService from '../services/CustomerService';
import RizeClient from '../utils/rizeClient';
import { AuthContextProps } from './Auth';

export type CustomerContextProps = {
    customer?: Customer;
    setCustomer: (customer: Customer) => Promise<void>;
    refreshCustomer: () => Promise<Customer>;
    resetState: () => void;
}

export const CustomerContext = React.createContext<CustomerContextProps>({
    customer: undefined,
    setCustomer: () => Promise.resolve(),
    refreshCustomer: () => Promise.resolve(null),
    resetState: () => null,
});

export interface CustomerProviderProps {
    children?: JSX.Element;
    auth: AuthContextProps;
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

    rize = RizeClient.getInstance();

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

    resetState = (): void => {
        this.setState(initialState);
    }

    refreshCustomer = async (): Promise<Customer> => {
        if (!this.state.customer) {
            return undefined;
        }

        const customer = await CustomerService.getCustomer(this.props.auth.accessToken);
        await this.promisedSetState({ customer });
        return customer;
    }

    render(): JSX.Element {
        const { customer } = this.state;

        return (
            <CustomerContext.Provider
                value={{
                    customer: customer,
                    setCustomer: this.setCustomer,
                    refreshCustomer: this.refreshCustomer,
                    resetState: this.resetState
                }}
            >
                {this.props.children}
            </CustomerContext.Provider>
        );
    }
}

export const CustomerConsumer = CustomerContext.Consumer;

export const useCustomer = (): CustomerContextProps => useContext(CustomerContext);