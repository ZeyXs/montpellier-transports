import 'react-native-gesture-handler';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import MTDrawerContent from '@/components/MTDrawerContent';

import '../../global.css';
import { DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function Layout() {

  const navigation = useNavigation();

  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={MTDrawerContent}
        screenOptions={{
          swipeEdgeWidth: 100,
          swipeMinDistance: 50,
          headerStyle: {
            backgroundColor: '#004295',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <MaterialIcons name="menu" size={24} color="white" className='mr-2 ml-4' />
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen
          name="home"
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
          name="schedules"
          options={{
            drawerActiveTintColor: '#925eff',
            drawerActiveBackgroundColor: '#e6dbff',
            drawerLabel: 'Temps réel',
            headerShown: false,
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="clock" size={size} color={color} />
            ),
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
