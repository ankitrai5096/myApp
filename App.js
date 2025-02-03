import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, View, Button, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import ShowTime from './ShowTime';

const App = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    requestAndroidPermissions();
  }, []);

  const requestAndroidPermissions = async () => {
    if (Platform.OS !== 'android') return;

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,  // 🎤 Microphone
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, // 🔔 Notification (Android 13+)
        PermissionsAndroid.PERMISSIONS.CALL_PHONE, // 📞 Call Phone (For making a call)
      ];

      const grantedPermissions = await PermissionsAndroid.requestMultiple(permissions);

      // ✅ Check if all required permissions are granted
      const micGranted = grantedPermissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
      const notifGranted = grantedPermissions[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED || Platform.Version < 33; // Ignore if Android < 13
      const phoneGranted = grantedPermissions[PermissionsAndroid.PERMISSIONS.CALL_PHONE] === PermissionsAndroid.RESULTS.GRANTED;

      if (micGranted && notifGranted && phoneGranted) {
        console.log('✅ All required permissions granted');
        setupCallKeep();
        fetchToken();
      } else {
        console.log('❌ Some required permissions were denied');
        console.log('Mic:', micGranted, '| Notif:', notifGranted, '| Phone:', phoneGranted);
      }
    } catch (error) {
      console.warn('Error requesting permissions:', error);
    }
  };

  const fetchToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Error fetching FCM token:', error);
    }
  };

  messaging().onMessage(async remoteMessage => {
    console.log('FCM Message Data:', remoteMessage.data);
    onMessageReceived(remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage.data);
    onMessageReceived(remoteMessage);
  });

  const onMessageReceived = async remoteMessage => {
    if (remoteMessage.data && remoteMessage.data.callUUID) {
      const { callUUID, handle, name } = remoteMessage.data;
      RNCallKeep.displayIncomingCall(callUUID, handle, name);
    }
  };

  const setupCallKeep = async () => {
    console.log('Setting up CallKeep...');
    const options = {
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'OK',
        imageName: 'phone_account_icon',
        additionalPermissions: [
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,  // 📞 Call Phone
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,  // 🎤 Microphone
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, // 🔔 Notifications
        ],
        foregroundService: {
          channelId: 'com.company.my',
          channelName: 'Foreground service for my app',
          notificationTitle: 'My app is running in the background',
          notificationIcon: 'phone_account_icon',
        },
      },
    };

    try {
      await RNCallKeep.setup(options);
      RNCallKeep.setAvailable(true);
      console.log('CallKeep setup completed');
    } catch (error) {
      console.error('Error setting up CallKeep:', error);
    }
  };

  const startCall = () => {
    const callUUID = 'unique-call-uuid';
    const handle = '+1234567890';
    const name = 'John Doe';

    try {
      RNCallKeep.startCall(callUUID, handle, name);
      console.log('Call started successfully');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const startIncomingCall = () => {
    const callUUID = 'unique-call-uuid';
    const handle = '+1234567890';
    const name = 'John Doe';

    try {
      RNCallKeep.displayIncomingCall(callUUID, handle, name);
      console.log('Incoming call displayed');
    } catch (error) {
      console.error('Error displaying incoming call:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Call" onPress={startCall} />
      <Button title="Request a call" onPress={startIncomingCall} />
      <ShowTime />
    </View>
  );
};

export default App;
