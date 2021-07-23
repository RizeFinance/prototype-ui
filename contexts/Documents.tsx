import React, { useContext } from 'react';
import { Document } from '../models';
import DocumentService from '../services/DocumentService';
import { AuthContext } from './Auth';

interface ViewableDoc {
  base_64: string
}

export type DocumentsContextProps = {
    isLoading: boolean;
    documents?: Document[];
    getDocuments: () => Promise<Document[]>;
    viewDocument: (uid: string) => Promise<ViewableDoc>;
}

export const DocumentsContext = React.createContext<DocumentsContextProps>({
    isLoading: false,
    documents: [],
    getDocuments: () => Promise.resolve([]),
    viewDocument: (uid: string) => Promise.resolve(),
});

export type DocumentProviderState = {
    isLoading: boolean;
    documents?: Document[];
};

const initialState = {
    isLoading: false,
    documents: [],
};

export interface DocumentsProviderProps {
    children?: JSX.Element;
}

export class DocumentsProvider extends React.Component<DocumentsProviderProps, DocumentProviderState> {
    static contextType = AuthContext;
    context: React.ContextType<typeof AuthContext>;

    constructor(props: DocumentsProviderProps) {
        super(props);

        this.state = initialState;
    }

    getDocuments = async (): Promise<Document[]> => {
        this.setState({ isLoading: true });
        
        try {
            const { data: documents } = await DocumentService.getDocuments(this.context.accessToken);
            this.setState({ documents });
            return { data: documents };
        } catch (err) {
            return { data: err };
        } finally {
            this.setState({ isLoading: false });
        }
    }

    viewDocument = async (uid: string): Promise<ViewableDoc> => {
        const response = await DocumentService.viewDocument(this.context.accessToken, uid)
        return response;
    }

    render(): JSX.Element {
        const { isLoading, documents } = this.state;

        return (
            <DocumentsContext.Provider
                value={{
                    isLoading: isLoading,
                    documents: documents,
                    getDocuments: this.getDocuments,
                    viewDocument: this.viewDocument
                }}
            >
                {this.props.children}
            </DocumentsContext.Provider>
        );
    }
}

export const DocumentsConsumer = DocumentsContext.Consumer;

export const useDocuments = (): DocumentsContextProps => useContext(DocumentsContext);
