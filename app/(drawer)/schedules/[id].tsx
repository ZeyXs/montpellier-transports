import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import apiClient from "@/util/apiClient";
import LineIcon from "@/components/icons/LineIcon";
import { linesColor } from "@/constants/LinesColor";
import { VisibleWhen } from "@/components/VisibleWhen";

interface PassInfo {
  delay: `${number} min` | `à ${number}:${number}`;
  direction: `${number}`;
  direction_name: string;
  trip_headsign: string;
  time: `${number}`;
  ligne: `${number}`;
}

interface Stop {
  nom: string;
  next_pass?: PassInfo;
  passes?: PassInfo[];
  isTerminus: boolean;
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
    aller: "",
    retour: "",
    couleur: "",
  });

  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const isIdValid = typeof id === "string" && id !== "";

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex flex-row items-center">
          <Text className="text-white text-2xl mr-2">Ligne </Text>
          {typeof id === "string" && <LineIcon lineId={id} />}
        </View>
      ),
    });
  }, [direction]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (isIdValid) {
      fetchData(direction);
    }
    const interval = setInterval(() => {
      fetchData(direction);
    }, 30000);

    return () => clearInterval(interval);
  }, [direction]);

  if (id === undefined || Array.isArray(id)) {
    return <Redirect href="/schedules" />;
  }
  const parsePassData = (apiResponse: any): PassInfo[] => {
    const allPasses: PassInfo[] = [];

    if (!apiResponse || typeof apiResponse !== "object") {
      return allPasses;
    }

    // Iterate through each line in the response
    Object.keys(apiResponse).forEach((lineId) => {
      const lineData = apiResponse[lineId];

      if (Array.isArray(lineData)) {
        // Handle structure like line "1" with array of direction objects
        lineData.forEach((directionGroup) => {
          Object.keys(directionGroup).forEach((destination) => {
            const passes = directionGroup[destination];
            if (Array.isArray(passes)) {
              allPasses.push(...passes);
            }
          });
        });
      } else if (typeof lineData === "object" && lineData !== null) {
        // Handle structure like line "19" with nested direction objects
        Object.keys(lineData).forEach((directionKey) => {
          const directionData = lineData[directionKey];
          if (typeof directionData === "object" && directionData !== null) {
            Object.keys(directionData).forEach((destination) => {
              const passes = directionData[destination];
              if (Array.isArray(passes)) {
                allPasses.push(...passes);
              }
            });
          }
        });
      }
    });

    // Sort by time (assuming time is in minutes from now)
    return allPasses.sort(
      (a, b) => parseInt(a.time || "0") - parseInt(b.time || "0")
    );
  };

  const renderPassInfo = (
    passes: PassInfo[],
    stop?: any,
    currentDirection?: number
  ) => {
    if (!passes || passes.length === 0) {
      // Show more specific message based on error type
      let message = "Pas d'horaires temps réel";
      if (stop?.error === 404) {
        message = "Aucune donnée temps réel";
      } else if (stop?.error) {
        message = `Erreur ${stop.error}`;
      }

      return (
        <View className="px-2 py-1 rounded-lg bg-gray-200">
          <Text className="text-gray-500 text-xs">{message}</Text>
        </View>
      );
    }

    // Filter passes by current direction (0 or 1)
    const filteredPasses = passes.filter(
      (pass) => parseInt(pass.direction) === currentDirection
    );

    if (filteredPasses.length === 0) {
      return (
        <View className="px-2 py-1 rounded-lg bg-gray-200">
          <Text className="text-gray-500 text-xs">
            Aucun passage dans cette direction
          </Text>
        </View>
      );
    }

    return (
      <View className="flex flex-row space-x-2 gap-x-2">
        {filteredPasses.slice(0, 3).map((pass, index) => (
          <View key={index} className="px-2 py-1 rounded-lg bg-[#22408e]">
            <Text className="text-white text-xs font-bold">{pass.delay}</Text>
          </View>
        ))}
        {filteredPasses.length > 3 && (
          <View className="px-2 py-1 rounded-lg bg-gray-300">
            <Text className="text-gray-600 text-xs">
              +{filteredPasses.length - 3}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const fetchData = async (direction: number) => {
    try {
      let response;

      if (id !== "96") {
        response = await apiClient.get(
          `/ligne/${id}/ordered-arrets/${direction}`
        );
      } else {
        response = await apiClient.get(`/ligne/${id}/ordered-arrets/`);
      }
      const { data } = response;
      setConstants({
        aller: data.ligne_param.nom_aller,
        retour: data.ligne_param.nom_retour,
        couleur: data.couleur,
      });

      // Fetch real-time pass data for each stop using logical_stop IDs
      const stopsWithPasses = await Promise.all(
        Object.values(data.stops).map(async (stop: any) => {
          const logicalStopId = stop.logical_stop;

          if (!logicalStopId) {
            return { ...stop, passes: [] };
          }

          const passResponse = await apiClient.get(`/stop/rt/${logicalStopId}`);

          if (passResponse.status !== 200) {
            return { ...stop, passes: [] };
          }

          const parsedPasses = parsePassData(passResponse.data);

          // Filter passes to only show the current line
          const filteredPasses = parsedPasses.filter(
            (pass) => pass.ligne === id || pass.ligne === id?.toString()
          );

          return {
            ...stop,
            passes: filteredPasses,
          };
        })
      );

      setStops(stopsWithPasses);
    } catch (error) {
      console.error("Error fetching line:", error);
    }
  };

  const handleReverse = () => {
    if (id == "96") {
      return;
    }
    const newDirection = direction === 0 ? 1 : 0;
    setDirection(newDirection);
    fetchData(newDirection);
  };

  const lastStop = stops[stops.length - 1];

  return (
    <ScrollView className="flex flex-col p-3">
      <View className="flex flex-row items-center px-2 mb-3">
        <VisibleWhen condition={id == "96"}>
          <Text className="flex-1 font-bold text-xl">La Navette Ovalie</Text>
        </VisibleWhen>
        <VisibleWhen condition={id == "13"}>
          <Text className="flex-1 font-bold text-xl">
            {direction === 0 ? constants.aller : constants.retour}
          </Text>
        </VisibleWhen>
        <VisibleWhen condition={id != "96" && id != "13"}>
          <Text
            numberOfLines={showFullDirection ? 3 : 1}
            onPress={() => setShowFullDirection(!showFullDirection)}
            className="flex-1 font-bold text-xl"
          >
            Vers {direction === 0 ? constants.aller : constants.retour}
          </Text>
        </VisibleWhen>
        <TouchableOpacity onPress={handleReverse}>
          <MaterialCommunityIcons
            name="swap-vertical"
            size={34}
            color={id == "96" ? "#8a8a8a" : "#4c72d9"}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-2 mt-3">
        {stops.map((stop, index) => (
          <View key={index} className="relative flex flex-row items-start mb-5">
            <View
              className="h-4 w-4 rounded-full mr-2.5 z-10 top-1.5 left-[2px]"
              style={
                typeof id === "string" && {
                  backgroundColor: stop.isTerminus ? "#1f1f1f" : linesColor[id],
                }
              }
            />
            <VisibleWhen condition={stop !== lastStop}>
              <View
                className="absolute top-4 left-[8px] w-[2px] h-[75px] z-0"
                style={
                  typeof id === "string" && { backgroundColor: linesColor[id] }
                }
              />
            </VisibleWhen>
            <View className="ml-2.5 flex flex-col flex-1 pr-4">
              <Text className="text-lg font-bold mb-2">{stop.nom}</Text>
              <View className="flex-1">
                {renderPassInfo(stop.passes || [], stop, direction)}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
