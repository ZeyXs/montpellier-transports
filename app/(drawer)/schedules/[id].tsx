import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';

interface Stop {
  nom: string;
  [key: string]: any;
}

interface Constants {
  aller: string;
  retour: string;
}

export default function LineSchedules() {
  const [showFullDirection, setShowFullDirection] = useState(false);
  const [direction, setDirection] = useState(0); // 0 for forth, 1 for back
  const [constants, setConstants] = useState<Constants>({ aller: '', retour: '' });
  const [stops, setStops] = useState<Stop[]>([]);

  const { id } = useLocalSearchParams();

  const fetchData = async (direction: number) => {
    try {
      const response = await axios.get(
        `https://cartographie.tam-voyages.com/gtfs/ligne/${id}/ordered-arrets/${direction}`
      );
      const data = response.data;
      setConstants({
        aller: data.ligne_param.nom_aller,
        retour: data.ligne_param.nom_retour,
      });
      setStops(Object.values(data.stops));
    } catch (error) {
      console.error('Error fetching line:', error);
    }
  };

  const handleReverse = () => {
    const newDirection = direction === 0 ? 1 : 0;
    setDirection(newDirection);
    fetchData(newDirection);
  };

  useEffect(() => {
    fetchData(direction);
  }, [direction]);

  return (
    <ScrollView className="flex flex-col p-3">
      <View className="flex flex-row items-center px-2">
        <Text
          numberOfLines={showFullDirection ? 3 : 1}
          onPress={() => setShowFullDirection(!showFullDirection)}
          className="flex-1 font-bold text-xl"
        >
          Vers {direction === 0 ? constants.aller : constants.retour}
        </Text>
        <TouchableOpacity onPress={handleReverse}>
          <MaterialCommunityIcons
            name="swap-vertical"
            size={34}
            color="#4c72d9"
          />
        </TouchableOpacity>
      </View>

      <View className='flex-1 p-2'>
        {stops.map((stop, index) => (
          <View key={index} className='relative flex flex-row items-start mb-5'>
            <View className='h-4 w-4 rounded-full mr-2.5 z-10 top-1.5 left-[2px] bg-black' />
            {stops.length - 1 !== index && <View className='absolute top-4 left-[8px] w-[2px] h-[55px] bg-black z-0' />}
            <View className='ml-2.5'>
              <Text className='text-lg font-bold'>{stop.nom}</Text>
              <Text className='text-gray-500'>{stop.nom}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
