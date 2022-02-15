import { StyleSheet } from 'react-native';
import { defaultColors } from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    height: 80,
    flex: 1,
    marginTop: 7,
    marginBottom: 12,
    borderRadius: 4,
  },
  button: {
    maxWidth: 500,
    marginBottom: 25,
  },
  errorContainer: {
    fontSize: 12,
    marginBottom: 20,
    color: defaultColors.error,
  },
  heading: {
    marginBottom: 30,
  },
  subHeading: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 25,
  },
  questionsContainer: {
    marginBottom: 30,
  },
  content: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: 30,
  },
  input: {
    marginTop: 2,
  },
  questionLabel: {
    fontSize: 16,
    lineHeight: 25,
  },
  questionContext: {
    fontSize: 16,
    lineHeight: 25,
  },
  questionNote: {
    fontSize: 12,
    lineHeight: 21,
    marginTop: 15,
    marginBottom: 15,
    fontStyle: 'italic'
  },
});

export default styles;
