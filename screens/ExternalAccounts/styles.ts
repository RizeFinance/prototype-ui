import { StyleSheet } from 'react-native';
import { defaultColors } from '../../constants/Colors';

const ArchiveScreen = StyleSheet.create({
  screen: {
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  ctaContainer: {
    marginTop: 60,
  },
  description: {
    marginTop: 20,
    marginBottom: 35,
  },
  warning: {
    fontWeight: 'bold',
  },
  button: {
    maxWidth: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  errorContainer: {
    fontSize: 12,
    marginBottom: 20,
    color: defaultColors.error,
  },
});

const AccountsScreen = StyleSheet.create({
  ctaContainer: {
    marginTop: 30,
  },
  status: {
    marginTop: 25,
  },
  loading: {
    marginTop: 25,
    marginBottom: 55,
  },
});

const AccountCard = StyleSheet.create({
  link: {
    marginBottom: 5,
  },
  cardContainer: {
    marginTop: 25,
    marginBottom: 25,
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 30,
  },
});

const ConnectScreen = StyleSheet.create({
  heading: {
    marginTop: 24,
    marginBottom: 24,
  },
  list: {
    marginBottom: 24,
  },
  bullet: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  loading: {
    marginTop: 55,
  },
});

const ConnectOneWayScreen = StyleSheet.create({
  heading: {
    marginTop: 24,
    marginBottom: 24,
  },
  connect: {
    marginTop: 10,
  },
});

export { AccountCard, ArchiveScreen, AccountsScreen, ConnectScreen, ConnectOneWayScreen };
