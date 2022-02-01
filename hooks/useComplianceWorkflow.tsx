import { useState, useEffect, useCallback } from 'react';
import { ComplianceWorkflowService } from '../services';
import * as Network from 'expo-network';
import { Customer } from '../models';
import { ComplianceWorkflow } from '@rizefinance/rize-js/types/lib/core/compliance-workflow';
import { ComplianceDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs'


const useComplianceWorkflow = (customerUid: string, accessToken: string) => {
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined);
  const [currentPendingDocs, setCurrentPendingDocs] = useState<ComplianceDocument[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | Record<string, never>>({});
  const [error, setError] = useState('');
  const [checkboxData, setCheckboxData] = useState([]);

  const parseWorkflow = useCallback((workflow) => {
  
    const checkboxData = workflow.current_step_documents_pending.reduce((acc, curr) => {
      const key = curr['uid'];
      acc[key] = false;
      return acc;
    }, {});

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
            customerUid,
            productCompliancePlanUid: compliance.product_compliance_plan_uid,
          });
          parseWorkflow(workflow)
          return;
        }

        parseWorkflow(compliance);
      } catch (err) {
        setError(err[0].title)
      }
    };
    getWorkflow();
  }, [accessToken, customerUid]);

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
    error
  };
};

export default useComplianceWorkflow;
