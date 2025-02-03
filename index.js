import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import SomeTask from './SomeTask';
import App from './App';

// Register the root component
registerRootComponent(App);

// Register the headless task
AppRegistry.registerHeadlessTask('SomeTaskName', () => SomeTask);

// Background message handler for when the app is killed
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background Message received:', remoteMessage);

  // Run the background task
  await SomeTask();
});
