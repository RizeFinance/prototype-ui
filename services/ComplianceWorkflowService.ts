import api from '../utils/api';

const viewLatestWorkflow = async (accessToken: string): Promise<any> => {
    return await api.get('/compliance_workflows/latest',
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((response) => response.data);
};

export default {
    viewLatestWorkflow
};
