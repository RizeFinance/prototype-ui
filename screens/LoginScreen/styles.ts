import { StyleSheet } from 'react-native';
import { useThemeColor } from '../../components/Themed';

const primary = useThemeColor('primary');

export const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 200,
    marginTop: -30,
    marginBottom: -25,
  },
  message: {
    marginTop: 4,
  },
  commonError: {
    marginTop: 4,
    marginBottom: -20,
  },
  inputContainer: {
    marginTop: 35,
    marginBottom: 30,
  },
  underline: {
    marginTop: 20,
    textDecorationLine: 'underline',
    textDecorationColor: primary,
    color: primary,
  },
  forgotAccount: {
    marginTop: 20,
  },
  links: {
    alignItems: 'center',
    marginTop: 20,
  },
});
