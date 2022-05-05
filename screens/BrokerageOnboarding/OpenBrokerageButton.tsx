import React, { useState } from 'react';
import { Button } from '../../components';
import { useBrokerageWorkflow } from '../../contexts';
import { SyntheticAccount } from '../../models';
import styles from './styles';
import { some } from 'lodash';
import config from '../../config/config';
import { AccountCategory } from '../../types';

export default function OpenBrokerageButton({
  accounts,
}: {
  accounts: SyntheticAccount[];
}): JSX.Element {
  const { findOrCreateBrokerageWorkflow } = useBrokerageWorkflow();
  const [loading, setLoading] = useState(false);
  const brokerageUid = config.application.brokerageProductUid;

  const startBrokerage = async () => {
    setLoading(true);
    await findOrCreateBrokerageWorkflow();
    setLoading(false);
  };

  if (
    !brokerageUid ||
    some(
      accounts,
      (account) => account.synthetic_account_category === AccountCategory.TARGET_YEILD_ACCOUNT
    )
  )
    return <></>;
  return (
    <Button
      style={styles.button}
      title="Open Target Yield Brokerage Account"
      onPress={startBrokerage}
      loading={loading}
    />
  );
}
