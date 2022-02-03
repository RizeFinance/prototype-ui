import React, { useContext, useEffect, useState, createContext, useMemo, useCallback } from 'react';
import { ComplianceWorkflowService } from '../services';
import {
  ComplianceDocument,
  ComplianceWorkflow,
} from '@rizefinance/rize-js/types/lib/core/typedefs/compliance-workflow.typedefs';
import { useAuth } from '../contexts';
import * as Network from 'expo-network';

interface ICompliance {
  currentPendingDocs: ComplianceDocument[] | [];
  acceptedDocuments: ComplianceDocument[] | [];
  complianceIsLoading: boolean;
  workflow: ComplianceWorkflow | Record<string, any>;
  error: string;
  checkboxData: any;
  patriotAccepted: boolean | undefined;
  submitAgreements: any;
  setError: any;
}

const initWorkflow = {
  uid: '',
  summary: {
    status: 'in_progress',
  },
};

export const ComplianceContext = createContext({} as ICompliance);

const ComplianceProvider = ({ children }) => {
  const [currentPendingDocs, setCurrentPendingDocs] = useState<ComplianceDocument[] | []>([]);
  const [acceptedDocuments, setAcceptedDocuments] = useState<ComplianceDocument[] | []>([]);
  const [complianceIsLoading, setComplianceIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState<ComplianceWorkflow | Record<string, any>>(initWorkflow);
  const [error, setError] = useState('');
  const [checkboxData, setCheckboxData] = useState({});
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
    setWorkflow(workflow);
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
        setError(err[0].title || 'Something went wrong. Please try again later.');
      }
    };
    if (authCustomer) {
      getWorkflow();
    }
  }, [accessToken, authCustomer, parseWorkflow]);

  const submitAgreements = async (values, actions) => {
    setComplianceIsLoading(true);
    const ip_address = await Network.getIpAddressAsync();

    const documents = Object.keys(values).map((document_uid) => {
      return {
        accept: 'yes',
        document_uid,
        ip_address,
        user_name: authCustomer.email,
      };
    });

    try {
      const updatedComplianceWorkflow = await ComplianceWorkflowService.acknowledgeDocuments(
        accessToken,
        documents
      );
      parseWorkflow(updatedComplianceWorkflow);

      setComplianceIsLoading(false);
      actions.resetForm();
    } catch (err) {
      setError(err[0].title);
      setComplianceIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      currentPendingDocs,
      acceptedDocuments,
      complianceIsLoading,
      workflow,
      error,
      checkboxData,
      patriotAccepted,
      submitAgreements,
      setError,
    }),
    [
      currentPendingDocs,
      acceptedDocuments,
      complianceIsLoading,
      workflow,
      error,
      checkboxData,
      patriotAccepted,
      submitAgreements,
      setError,
    ]
  );

  return <ComplianceContext.Provider value={value}>{children}</ComplianceContext.Provider>;
};

const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a Compliance Provider');
  }
  return context;
};

export { ComplianceProvider, useCompliance };
