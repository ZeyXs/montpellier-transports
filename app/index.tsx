import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <Redirect href="(drawer)/home" />
  );
};