import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import LineIcon from '@/components/icons/LineIcon';
import { linesColor } from '@/constants/LinesColor';

interface Stop {
  nom: string;
  [key: string]: any;
}

interface Constants {
  aller: string;
  retour: string;
  couleur: string;
}

export default function LineSchedules() {
  const [showFullDirection, setShowFullDirection] = useState(false);
  const [direction, setDirection] = useState(0); // 0 for forth, 1 for back
  const [stops, setStops] = useState<Stop[]>([]);
  const [constants, setConstants] = useState<Constants>({
    aller: '',
    retour: '',
    couleur: '',
  });

  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const fetchData = async (direction: number) => {
    try {
      let response;
      if (id !== '96') {
        response = await axios.get(
          `https://cartographie.tam-voyages.com/gtfs/ligne/${id}/ordered-arrets/${direction}`
        );
      } else {
        response = await axios.get(
          `https://cartographie.tam-voyages.com/gtfs/ligne/${id}/ordered-arrets/`
        );
      }
      const data = response.data;
      setConstants({
        aller: data.ligne_param.nom_aller,
        retour: data.ligne_param.nom_retour,
        couleur: data.couleur,
      });
      setStops(Object.values(data.stops));
    } catch (error) {
      console.error('Error fetching line:', error);
    }
  };

  const handleReverse = () => {
    if (id == '96') return;
    const newDirection = direction === 0 ? 1 : 0;
    setDirection(newDirection);
    fetchData(newDirection);
  };
  
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex flex-row items-center">
          <Text className='text-white text-2xl mr-2'>Ligne </Text>
          {typeof id === 'string' && <LineIcon lineId={id} />}
        </View>
      ),
    });
    fetchData(direction);
  }, [direction]);

  useEffect(() => {
    typeof id == 'string' && console.log('id', linesColor[id]);
  }, []);

  return (
    <ScrollView className="flex flex-col p-3">
      <View className="flex flex-row items-center px-2">
        {id == '96' ? (
          <Text className="flex-1 font-bold text-xl">La Navette Ovalie</Text>
        ) : id == '13' ? (
          <Text className="flex-1 font-bold text-xl">
            {direction === 0 ? constants.aller : constants.retour}
          </Text>
        ) : (
          <Text
            numberOfLines={showFullDirection ? 3 : 1}
            onPress={() => setShowFullDirection(!showFullDirection)}
            className="flex-1 font-bold text-xl"
          >
            Vers {direction === 0 ? constants.aller : constants.retour}
          </Text>
        )}
        <TouchableOpacity onPress={handleReverse}>
          <MaterialCommunityIcons
            name="swap-vertical"
            size={34}
            color={id == '96' ? '#8a8a8a' : '#4c72d9'}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-2 mt-3">
        {stops.map((stop, index) => (
          <View key={index} className="relative flex flex-row items-start mb-5">
            <View
              className="h-4 w-4 rounded-full mr-2.5 z-10 top-1.5 left-[2px]"
              style={
                typeof id === 'string' && {
                  backgroundColor: stop.isTerminus ? '#1f1f1f' : linesColor[id],
                }
              }
            />
            {stops.length - 1 !== index && (
              <View
                className="absolute top-4 left-[8px] w-[2px] h-[55px] z-0"
                style={
                  typeof id === 'string' && { backgroundColor: linesColor[id] }
                }
              />
            )}
            <View className="ml-2.5 flex flex-row justify-between items-center w-full pr-10">
              <View className='flex flex-col'>
                <Text className="text-lg font-bold">{stop.nom}</Text>
                <View className='h-4'></View>
              </View>
              {stop['next_pass'] != null && <View className='px-2 h-6 rounded-lg bg-[#22408e]'>
                <Text className='text-white text-sm'>{stop['next_pass'].delay}</Text>
              </View>}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
