import React, { useState, useEffect } from 'react';
import { Dropdown, Screen, Input, Button, Body, Heading3, TextLink } from '../../components';
import { useAuth, useAccounts, useCompliance, ProductType } from '../../contexts';
import { AccountService } from '../../services';
import styles from './styles';
import config from '../../config/config';
import { get, find } from 'lodash';

export interface ITypes {
  uid: string;
  name: string;
  synthetic_account_category: string;
  description: string;
  program_uid: string;
}

const AccountTypes = {
  general: 'Checking',
  target_yield_account: 'Target Yield Brokerage',
};

const AccountsSetupScreen = ({ navigation }) => {
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [selection, setSelection] = useState([]);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeSelected, setTypeSelected] = useState('');
  const [disabled, setDisabled] = useState(true);
  const { accessToken, customerProducts } = useAuth();
  const { liabilityAccounts, refetchAccounts } = useAccounts();

  const brokerageProductUid = config.application.brokerageProductUid;

  const {
    loadComplianceWorkflows,
    setComplianceWorkflow,
    customerWorkflows,
    createComplianceWorkflow,
  } = useCompliance();

  useEffect(() => {
    const loadComplianceWorflows = async () => {
      await loadComplianceWorkflows({ product_uid: [brokerageProductUid] });
    };

    if (brokerageProductUid) {
      loadComplianceWorflows();
    }
  }, [brokerageProductUid]);

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

  const brokerageSelected = typeSelected === AccountTypes.target_yield_account;

  const hideBrokerageOption = () => {
    if (
      existingBrokerageAccount ||
      (existingBrokerageAccount && existingBrokerageProduct) ||
      !brokerageProductUid
    ) {
      return true;
    } else {
      return false;
    }
  };

  const products = (types) => {
    const selection = types
      .filter((type) => type.synthetic_account_category !== 'external')
      .map((type) => {
        return {
          label: AccountTypes[type.synthetic_account_category],
          value: type.uid,
        };
      });

    if (hideBrokerageOption()) {
      const noBrokerage = selection.filter(
        (option) => option.label !== AccountTypes.target_yield_account
      );
      setSelection(noBrokerage);
    } else {
      setSelection(selection);
    }
  };

  useEffect(() => {
    const getTypes = async () => {
      const { data: types } = await AccountService.getSyntheticAccountTypes(accessToken);

      if (types.length > 0) {
        products(types);
      }
    };
    getTypes();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Accounts</TextLink>,
    });
  }, [navigation]);

  const poolUid = liabilityAccounts[0].pool_uid;

  const createAccount = async () => {
    if (!hideBrokerageOption() || inProgressWorkflow) {
      let workflow = inProgressWorkflow || completedWorkflow;

      if (!workflow) {
        workflow = await createComplianceWorkflow(brokerageProductUid);
      }

      await setComplianceWorkflow(workflow);
      navigation.navigate('ConfirmPII', { productType: ProductType.Brokerage });
      return;
    } else {
      try {
        setLoading(true);
        await AccountService.createSyntheticAccount({
          accessToken,
          name: name.trim(),
          syntheticAccountTypeUid: account,
          poolUid,
        });
        await refetchAccounts();
        navigation.navigate('Accounts');
        setLoading(false);
      } catch (error) {
        setShowError(true);
        setName('');
        setLoading(false);
      }
    }
  };

  const handleSelection = (value) => {
    setAccount(value);
    const account = selection.find((accountType) => accountType.value === value);

    if (account && account.label) {
      setTypeSelected(
        account.label === AccountTypes.target_yield_account
          ? AccountTypes.target_yield_account
          : AccountTypes.general
      );
    }
  };

  useEffect(() => {
    const buttonDisabled = () => {
      if (typeSelected === AccountTypes.general && name !== '') {
        setDisabled(false);
      } else if (brokerageSelected) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
    buttonDisabled();
  }, [typeSelected, name, brokerageSelected]);

  const buttonTitle = () => {
    if (hideBrokerageOption()) {
      return 'Add Account';
    }

    if (!hideBrokerageOption()) {
      return 'Open Brokerage Account';
    }

    if (inProgressWorkflow) {
      return 'Continue Brokerage Account Setup';
    }
  };

  return (
    <Screen withoutHeader>
      <Heading3 textAlign="center" style={styles.heading}>
        Additional Account Setup
      </Heading3>

      {showError && (
        <Body color="success" textAlign="center" fontWeight="semibold" style={styles.error}>
          Unable to create account at this time.
        </Body>
      )}

      <Dropdown
        label="Issue"
        placeholder="Select Type of Account"
        items={selection}
        disabled={selection.length < 1}
        value={account}
        containerStyle={styles.marginBottom}
        onChange={handleSelection}
      />

      {!brokerageSelected && (
        <Input
          label="Name Your New Account"
          onChangeText={setName}
          value={name}
          containerStyle={styles.marginBottom}
        />
      )}

      <Button
        style={styles.button}
        title={buttonTitle()}
        onPress={createAccount}
        disabled={disabled}
        loading={loading}
      />
    </Screen>
  );
};

export default AccountsSetupScreen;
