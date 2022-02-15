import React, { useState, useEffect } from 'react';
import { Dropdown, Screen, Input, Button, Body, Heading3, TextLink } from '../../components';
import { useAuth, useAccounts } from '../../contexts';
import { AccountService } from '../../services';
import styles from './styles';
import { SyntheticAccountType } from '../../models';

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
  const { accessToken } = useAuth();
  const { liabilityAccounts, refetchAccounts } = useAccounts();

  const products = (types: SyntheticAccountType[]) => {
    const selection = types
      .filter((type) => type.synthetic_account_category === 'general')
      .map((type) => {
        return {
          label: AccountTypes[type.synthetic_account_category],
          value: type.uid,
        };
      });
    setSelection(selection);
  };

  useEffect(() => {
    const getTypes = async () => {
      const { data: types } = await AccountService.getSyntheticAccountTypes(accessToken);

      if (types.length > 0) {
        products(types);
      }
    };
    getTypes();
  }, [accessToken]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TextLink onPress={() => navigation.goBack()}>&lt; Accounts</TextLink>,
    });
  }, [navigation]);

  const poolUid = liabilityAccounts[0].pool_uid;

  const createAccount = async () => {
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
      } else {
        setDisabled(true);
      }
    };
    buttonDisabled();
  }, [typeSelected, name]);

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
      <Input
        label="Name Your New Account"
        onChangeText={setName}
        value={name}
        containerStyle={styles.marginBottom}
      />

      <Button
        style={styles.button}
        title="Add Account"
        onPress={createAccount}
        disabled={disabled}
        loading={loading}
      />
    </Screen>
  );
};

export default AccountsSetupScreen;
