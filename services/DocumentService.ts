import api from '../utils/api';

const getDocuments = async (accessToken: string): Promise<RizeList<DebitCard>> => {
  return await api
    .get('/documents', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

const viewDocument = async (
  accessToken: string,
  documentUid: string
): Promise<RizeList<DebitCard>> => {
  return await api
    .get(`/documents/${documentUid}/view`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

export default {
  getDocuments,
  viewDocument,
};
