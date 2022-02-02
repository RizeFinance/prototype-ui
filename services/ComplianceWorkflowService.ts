import { ComplianceWorkflow } from '@rizefinance/rize-js/types/lib/core/compliance-workflow';
import { ComplianceDocumentAcknowledgementRequest, RizeList } from '../models';
import toQueryString from '../utils/toQueryString';
import api from '../utils/api';

interface IQuery {
  product_uid: string[];
  in_progress: boolean;
  limit: number;
  offset: number;
}

const getCustomerWorkflows = async (accessToken: string, query: IQuery): Promise<any> => {
  return await api
    .get(`/compliance_workflows${toQueryString(query)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

const viewLatestWorkflow = async (accessToken: string): Promise<any> => {
  return await api
    .get('/compliance_workflows/latest', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => response.data);
};

const acknowledgeDocuments = async (
  accessToken: string,
  documents: ComplianceDocumentAcknowledgementRequest | ComplianceDocumentAcknowledgementRequest[]
): Promise<any> => {
  return await api
    .post(
      '/compliance_workflows/batch_acknowledge_documents',
      { documents: Array.isArray(documents) ? documents : [documents] },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const createWorkflow = async ({
  accessToken,
  customerUid,
  productCompliancePlanUid,
}): Promise<ComplianceWorkflow> => {
  const { data } = await api.post(
    '/compliance_workflows',
    { productCompliancePlanUid, customerUid },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return data;
};

// TODO: this needs to be updated in middleware. Data sent is failing and doesn't match API
const renewWorkflow = async (accessToken: string): Promise<any> => {
  return await api
    .post(
      '/compliance_workflows/renew',
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((response) => response.data);
};

const getComplianceWorkflows = async (
  accessToken: string,
  customerUid: string
): Promise<RizeList<ComplianceWorkflow>> => {
  return await api
    .get(`/compliance_workflows?customer_uid[]=${customerUid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

export {
  getCustomerWorkflows,
  viewLatestWorkflow,
  acknowledgeDocuments,
  createWorkflow,
  renewWorkflow,
  getComplianceWorkflows,
};
