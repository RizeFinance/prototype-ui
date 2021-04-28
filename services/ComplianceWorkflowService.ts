import api from '../utils/api';

const viewLatestWorkflow = async (accessToken: string): Promise<any> => {
    return await api.get('/compliance_workflows/latest',
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

const acknowledgeDocuments = async (
    accessToken: string,
    documents: any,
): Promise<any> => {
    return await api.post('/compliance_workflows/batch_acknowledge_documents',
        { documents: Array.isArray(documents) ? documents : [documents] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    viewLatestWorkflow,
    acknowledgeDocuments
};
