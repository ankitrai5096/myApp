import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowTime = () => {
  const [time, setTime] = useState(null);

  // Function to fetch the saved time
  const getTimeFromStorage = async () => {
    try {
      const savedTime = await AsyncStorage.getItem('backgroundTime');
      setTime(savedTime ? savedTime : 'No time saved');
    } catch (error) {
      console.log('Error retrieving time from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getTimeFromStorage();
  }, []);

  return (
    <View>
      <Text>Saved Time: {time}</Text>
      <Button title="Refresh Time" onPress={getTimeFromStorage} />
    </View>
  );
};

export default ShowTime;
