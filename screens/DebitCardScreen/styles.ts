import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heading: {
    marginBottom: 25,
  },
  loading_heading: {
    marginTop: 25,
  },
  success: {
    color: '#2ecc71',
    marginBottom: 25,
  },
  failed: {
    color: '#e74c3c',
    marginBottom: 25,
  },
  container: {
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 35,
  },
  column: {
    flex: 1,
  },
  columnHeading: {
    marginBottom: 5,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginRight: 10,
  },
  input: {
    marginBottom: 15,
  },
  reissueContainer: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    paddingTop: 40,
    marginTop: 60,
    marginBottom: 15,
  },
  activateContainer: {
    marginTop: 60,
  },
});
