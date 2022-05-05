import { RizeList, Document, ViewableDoc } from '../models';
import api from '../utils/api';

const getDocuments = async (accessToken: string): Promise<RizeList<Document>> => {
  return await api
    .get('/documents', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

const viewDocument = async (accessToken: string, documentUid: string): Promise<ViewableDoc> => {
  return await api
    .get(`/documents/${documentUid}/view`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

export default {
  getDocuments,
  viewDocument,
};
