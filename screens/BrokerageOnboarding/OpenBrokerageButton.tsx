import React, { useState } from 'react';
import { Button } from '../../components';
import { useBrokerageWorkflow } from '../../contexts';
import styles from './styles';

export default function OpenBrokerageButton(): JSX.Element {
  const { findOrCreateBrokerageWorkflow } = useBrokerageWorkflow();
  const [loading, setLoading] = useState(false);

  const startBrokerage = async () => {
    setLoading(true);
    await findOrCreateBrokerageWorkflow();
    setLoading(false);
  };

  return (
    <Button
      style={styles.button}
      title="Open Target Yeild Brokerage Account"
      onPress={startBrokerage}
      loading={loading}
    />
  );
}
