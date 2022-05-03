import { StyleSheet } from 'react-native';
import { defaultColors } from '../../constants/Colors';

const AccountScreen = StyleSheet.create({
  heading: {
    marginTop: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  contactSupport: {
    marginTop: 48,
  },
  formGroup: {
    marginVertical: 10,
  },
  connectStatusMessage: {
    marginVertical: 8,
  },
  accountContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: defaultColors.primary,
    borderRadius: 4,
  },
  accountName: {
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 55,
  },
});

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
  link: {
    marginBottom: 30,
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
});

export { ArchiveScreen, AccountScreen, AccountsScreen, ConnectScreen };
