import { View, Text, Button } from 'react-native';
import React from 'react';
import {
  router,
  Stack,
  Tabs,
  useNavigation,
  useRouter,
  useSegments,
} from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {

  const navigation = useNavigation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Temps réel',
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: { backgroundColor: '#004295' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <MaterialIcons name="menu" size={24} color="white" style={{ marginRight: 25 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Les ids',
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#004295' },
          headerBackButtonMenuEnabled: false,
        }}
      />
    </Stack>
  );
}
