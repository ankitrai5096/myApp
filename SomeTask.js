import AsyncStorage from '@react-native-async-storage/async-storage';

module.exports = async () => {
  console.log('Background task running');

  // Get the current time
  const currentTime = new Date().toISOString();

  try {
    // Save the current time to AsyncStorage
    await AsyncStorage.setItem('backgroundTime', currentTime);
    console.log('Time saved in AsyncStorage:', currentTime);
  } catch (error) {
    console.log('Error saving time in AsyncStorage:', error);
  }

  return Promise.resolve();
};
