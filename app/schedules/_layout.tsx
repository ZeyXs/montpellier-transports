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
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function TabsLayout() {
  const router = useRouter();
  const segment = useSegments();
  const nav = useNavigation<DrawerNavigationProp<{}>>();

  return (
    <Stack
      screenOptions={{
        headerBackButtonMenuEnabled: true
      }}
    ></Stack>
  );
}
