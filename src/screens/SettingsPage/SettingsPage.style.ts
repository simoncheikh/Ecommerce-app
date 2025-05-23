import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor will be set dynamically based on theme
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 12,
    // backgroundColor will be set dynamically based on theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchLabelText: {
    fontSize: 18,
    fontWeight: '600',
    // color will be set dynamically based on theme
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onOffText: {
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 16,
    width: 30,
    textAlign: 'center',
    // color will be set dynamically based on theme
  },
});
