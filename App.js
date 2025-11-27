import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Foundation } from '@expo/vector-icons';
import { initDB } from './Database';

import HomeScreen from './screens/HomeScreen';
import AddHikeScreen from './screens/AddHikeScreen';
import HikeDetailScreen from './screens/HikeDetailScreen';

const Stack = createStackNavigator();

const CustomHeader = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
    <Foundation name="mountains" size={32} color="#2c3e50" style={{ marginRight: 10 }} />
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>Hiking Tracker</Text>
      <Text style={{ fontSize: 12, color: '#7f8c8d' }}>Track your adventures</Text>
    </View>
  </View>
);

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <CustomHeader />,
            headerStyle: {
              height: 100, // Increased height to accommodate the subtitle
              backgroundColor: '#fff',
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerTitleContainerStyle: {
              left: 0, // Align to left
            }
          }}
        />
        <Stack.Screen
          name="AddHike"
          component={AddHikeScreen}
          options={{ title: 'Add New Hike' }}
        />
        <Stack.Screen
          name="HikeDetail"
          component={HikeDetailScreen}
          options={{ title: 'Hike Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
