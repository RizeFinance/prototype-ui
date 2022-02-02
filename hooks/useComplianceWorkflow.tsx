import { useState, useEffect, useCallback } from 'react';
import { ComplianceWorkflowService } from '../services';
import * as Network from 'expo-network';
import { Customer } from '../models';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
import { useAuth } from '../contexts';

const useComplianceWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined);
  const [currentPendingDocs, setCurrentPendingDocs] = useState<ComplianceDocument[] | []>([]);
  const [acceptedDocuments, setAcceptedDocuments] = useState<ComplianceDocument[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | Record<string, never>>({});
  const [error, setError] = useState('');
  const [checkboxData, setCheckboxData] = useState([]);
  const [patriotAccepted, setPatriotAccepted] = useState(undefined);
  const { customer: authCustomer, accessToken } = useAuth();

  const parseWorkflow = useCallback((workflow) => {
    const step2Doc = workflow.all_documents.find((doc: ComplianceDocument) => doc.step === 2);

    const isPatriotAccepted = workflow.accepted_documents.find(
      (doc: ComplianceDocument) => doc.external_storage_name === step2Doc.external_storage_name
    );

    const checkboxData = workflow.current_step_documents_pending.reduce((acc, curr) => {
      const key = curr['uid'];
      acc[key] = false;
      return acc;
    }, {});

    setAcceptedDocuments(workflow.accepted_documents);
    setPatriotAccepted(isPatriotAccepted ? true : false);
    setCheckboxData(checkboxData);
    setCurrentPendingDocs(workflow.current_step_documents_pending);
    setCurrentStep(workflow.summary.current_step);
    setCustomer(workflow.customer);
  }, []);

  useEffect(() => {
    const getWorkflow = async () => {
      try {
        const compliance = await ComplianceWorkflowService.viewLatestWorkflow(accessToken);

        if (compliance.summary.status === 'expired') {
          const workflow = await ComplianceWorkflowService.createWorkflow({
            accessToken,
            customerUid: authCustomer.uid,
            productCompliancePlanUid: compliance.product_compliance_plan_uid,
          });
          parseWorkflow(workflow);
          return;
        }

        parseWorkflow(compliance);
      } catch (err) {
        setError(err[0].title);
      }
    };

    getWorkflow();
  }, [accessToken, authCustomer, parseWorkflow]);

  const submitAgreements = async (values, actions) => {
    setIsLoading(true);
    const ip_address = await Network.getIpAddressAsync();

    const documents = Object.keys(values).map((document_uid) => {
      return {
        accept: 'yes',
        document_uid,
        ip_address,
        user_name: customer.email,
      };
    });

    try {
      const updatedComplianceWorkflow = await ComplianceWorkflowService.acknowledgeDocuments(
        accessToken,
        documents
      );
      parseWorkflow(updatedComplianceWorkflow);

      setIsLoading(false);
      actions.resetForm();
    } catch (err) {
      setError(err[0].title);
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    currentPendingDocs,
    submitAgreements,
    checkboxData,
    isLoading,
    error,
    patriotAccepted,
    setError,
    acceptedDocuments,
  };
};

export default useComplianceWorkflow;
