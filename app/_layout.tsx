import 'react-native-gesture-handler';
import { View, Image, SafeAreaView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import MTDrawerContent from '@/components/MTDrawerContent';

import '../global.css';
import { Fragment } from 'react';

export default function Layout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={MTDrawerContent}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#004295',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerLabelStyle: { marginLeft: -16 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Menu principal',
            headerTitle: 'Montpellier Transports',
            drawerIcon: ({ size, color }) => (
              <FontAwesome6 name="house" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="itinerary"
          options={{
            drawerActiveTintColor: '#ffc219',
            drawerActiveBackgroundColor: '#fff0cf',
            drawerLabel: 'Itinéraires',
            headerTitle: 'Itinéraires',
            drawerIcon: ({ size, color }) => (
              <FontAwesome6 name="map-location-dot" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="realtime"
          options={{
            drawerActiveTintColor: '#925eff',
            drawerActiveBackgroundColor: '#e6dbff',
            drawerLabel: 'Temps réel',
            headerTitle: 'Temps réel',
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="clock" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
