import { StyleSheet } from 'react-native';
import { useThemeColor } from '../../components/Themed';

const errorColor = useThemeColor('error');

const styles = StyleSheet.create({
  heading: {
    marginVertical: 24,
  },
  loading: {
    marginTop: 25,
  },
  accountInfo: {
    marginVertical: 16,
  },
  accountName: {
    marginBottom: 8,
  },
  btnContainer: {
    paddingBottom: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  button: {
    maxWidth: 500,
    marginBottom: 25,
  },
  error: {
    marginVertical: 8,
    color: errorColor,
  },
  marginBottom: {
    marginBottom: 15,
  },
});

export default styles;
