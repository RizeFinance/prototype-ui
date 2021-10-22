import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components';
import { useComplianceWorkflow, ProductType } from '../../contexts/ComplianceWorkflow';
import { useAuth } from '../../contexts/Auth';
import { useAccounts } from '../../contexts/Accounts';
import config from '../../config/config';
import { get, find } from 'lodash';

const BrokerageOnboardingButton = (): JSX.Element => {
  const navigation = useNavigation();
  const brokerageProductUid = config.application.brokerageProductUid;

  const {
    loadComplianceWorkflows,
    setComplianceWorkflow,
    customerWorkflows,
    createComplianceWorkflow,
  } = useComplianceWorkflow();

  const { liabilityAccounts } = useAccounts();
  const { customerProducts } = useAuth();

  useEffect(() => {
    (async () => {
      if (brokerageProductUid) {
        await loadComplianceWorkflows({ product_uid: [brokerageProductUid] });
      }
    })();
  }, []);

  const completedWorkflow = find(
    customerWorkflows,
    (workflow) => get(workflow, ['summary', 'status']) === 'accepted'
  );
  const inProgressWorkflow = find(
    customerWorkflows,
    (workflow) => get(workflow, ['summary', 'status']) === 'in_progress'
  );
  const existingBrokerageProduct = find(customerProducts, { product_uid: brokerageProductUid });
  const existingBrokerageAccount = find(liabilityAccounts, {
    synthetic_account_category: 'target_yield_account',
  });

  const onHandleOpenBrokerage = async () => {
    let workflow = inProgressWorkflow || completedWorkflow;

    if (!workflow) {
      workflow = await createComplianceWorkflow(brokerageProductUid);
    }

    await setComplianceWorkflow(workflow);
    navigation.navigate('ConfirmPII', { productType: ProductType.Brokerage });
  };

  const styles = StyleSheet.create({
    button: {
      maxWidth: 500,
      marginBottom: 25,
    },
  });

  if ((existingBrokerageAccount && existingBrokerageProduct) || !brokerageProductUid) return null;

  return (
    <Button
      title={inProgressWorkflow ? 'Continue Brokerage Account' : 'Open Brokerage Account'}
      style={styles.button}
      onPress={onHandleOpenBrokerage}
    />
  );
};

export default BrokerageOnboardingButton;
