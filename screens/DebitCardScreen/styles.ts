import { StyleSheet } from 'react-native';
import { defaultColors } from '../../constants/Colors';

export const styles = StyleSheet.create({
  heading: {
    marginBottom: 25,
  },
  report: {
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  status: {
    marginRight: 15,
  },
  alert: {
    marginBottom: 15,
    textAlign: 'center',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  switch: {
    marginRight: 10,
  },
  select: {
    bottom: 25,
  },
  reissueContainer: {
    borderTopColor: 'black',
    flex: 1,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    marginBottom: 15,
  },
  dcContainer: {
    marginBottom: 40,
  },
  alertSuccess: {
    color: defaultColors.success,
  },
  alertFailure: {
    color: defaultColors.error,
  },
  imageContainer: {
    height: 275,
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  shadowImageContainer: {
    shadowOpacity: 0.1,
    shadowColor: 'black',
    shadowOffset: { width: 7, height: 7 },
    shadowRadius: 20,
    overflow: 'hidden',
  },
  btnContainer: {
    justifyContent: 'space-around',
  },
});
