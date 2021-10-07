import { ComplianceWorkflow } from '@rizefinance/rize-js/types/lib/core/compliance-workflow';
import { ComplianceDocumentAcknowledgementRequest, RizeList } from '../models';
import api from '../utils/api';

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

export default {
  viewLatestWorkflow,
  acknowledgeDocuments,
  renewWorkflow,
  getComplianceWorkflows,
};
