import { RouteProp } from '@react-navigation/native';
import * as React from 'react';
import { Screen } from '../components';
import { Heading3 } from '../components/Typography';
import { RootStackParamList } from '../types';

interface ApplicationUnapprovedScreenProps {
  route: RouteProp<RootStackParamList, 'ApplicationUnapproved'>;
}

export default function ApplicationUnapprovedScreen({
  route,
}: ApplicationUnapprovedScreenProps): JSX.Element {
  let message = 'Your application';

  switch (route.params.status) {
    case 'rejected':
      message += ' was rejected.';
      break;
    case 'manual_review':
    case 'under_review':
      message += ' is under manual review.';
      break;
  }

  return (
    <Screen>
      <Heading3 textAlign="center" style={{ marginTop: 100 }}>
        {message}
      </Heading3>
    </Screen>
  );
}
