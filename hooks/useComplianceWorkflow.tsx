import React, { useState, useEffect, useCallback } from 'react';
import { ComplianceWorkflowService } from '../services';
import * as Network from 'expo-network';

const useComplianceWorkflow = (customerUid: string, accessToken: string) => {
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined);
  const [totalSteps, setTotalSteps] = useState(undefined);
  const [currentPendingDocs, setCurrentPendingDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [error, setError] = useState(undefined);
  const [checkboxData, setCheckboxData] = useState([])

  const [internalSteps, setInternalSteps] = useState([])

  const [currentInternalStep, setCurrentInternalStep] = useState(0)

  console.log(currentInternalStep, 'currentInternalStep')


  const parseWorkflow = useCallback((workflow) => {
    let steps = 0;

    workflow.all_documents.forEach((doc) => {
      if (doc.step > steps) {
        steps = doc.step;
      }
    });

    let i = 1
    let test = []
    while(i <= steps + 1) {
      test.push(i)
      i++
    }

    setInternalSteps(test)
    

    const checkboxData = workflow.current_step_documents_pending.reduce(
      (acc, curr) => {
        const key = curr['uid'];
        acc[key] = false;
        return acc;
      },
      {}
    );

    setCheckboxData(checkboxData)
    setCurrentPendingDocs(workflow.current_step_documents_pending);
    setCurrentStep(workflow.summary.current_step);
    setTotalSteps(steps);
    setCurrentInternalStep(workflow.summary.current_step + 1)
    setCustomer(workflow.customer);
  }, []);

  useEffect(() => {
    const getWorkflow = async () => {
      try {
        const compliance = await ComplianceWorkflowService.viewLatestWorkflow(accessToken);

        console.log(compliance, 'compliance')

        if (compliance.summary.status === 'expired') {
          const data = await ComplianceWorkflowService.createWorkflow({
            accessToken,
            customerUid,
            productCompliancePlanUid: compliance.product_compliance_plan_uid,
          });
        }

        parseWorkflow(compliance);
      } catch (err) {
        console.log(err, 'err');
      }
    };
    getWorkflow();
  }, [accessToken, customerUid]);

  const submitAgreements = async (values, actions) => {
    setIsLoading(true);
    const ip_address = await Network.getIpAddressAsync();

    console.log(ip_address, 'ip_address');
    

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
      setError(err);
      setIsLoading(false);
    }
  };

 

  return {
    currentStep,
    totalSteps,
    currentPendingDocs,
    submitAgreements,
    checkboxData,
    isLoading,
    currentInternalStep,
    internalSteps
  };
};

export default useComplianceWorkflow;
