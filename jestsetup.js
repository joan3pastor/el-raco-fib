// LIBRARIES MOCKS

// @react-native-community/async-storage
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

// rn-fetch-blob
jest.mock('rn-fetch-blob', () => {
    return {
      DocumentDir: () => {},
      polyfill: () => {},
    }
  });

// react-native-extra-dimensions-android
jest.mock('react-native-extra-dimensions-android', () => {
  const get = function (arg) {return 400};
  return {get};
})

// react-native-push-notification
jest.mock('react-native-push-notification', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
  }
});

// react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
  }
});

// Date
const now = new Date("07/07/2020").getTime();
global.Date.now = jest.fn(() => now);
