import { View, Text } from "react-native";
import React from "react";
import { linesColor } from "@/constants/LinesColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Lines } from "@/constants/Lines";

import NavetteGareIcon from "./NavetteGareIcon";
import NavetteOvalieIcon from "./NavetteOvalieIcon";
import { VisibleWhen } from "../VisibleWhen";

interface LineIconProps {
  lineId: string;
}

export default function LineIcon({ lineId }: LineIconProps) {
  return (
    <View
      className={`flex justify-center items-center text-center p-2 h-12 ${
        Lines.urbanIds.includes(+lineId)
          ? "w-12 rounded-full"
          : Lines.extraUrbanIds.includes(+lineId)
          ? "w-12 rounded-lg"
          : "w-14 rounded-b-lg rounded-tl-lg"
      }`}
      style={{
        backgroundColor: linesColor[lineId],
      }}
    >
      <VisibleWhen condition={lineId == "13"}>
        <MaterialCommunityIcons
          name="rotate-3d-variant"
          className="right-[1px] bottom-[1px]"
          size={30}
          color="white"
        />
      </VisibleWhen>

      <VisibleWhen condition={lineId == "50"}>
        <NavetteGareIcon width={20} height={20} color="white" />
      </VisibleWhen>

      <VisibleWhen condition={lineId == "96"}>
        <NavetteOvalieIcon width={25} height={25} color="white" />
      </VisibleWhen>

      <VisibleWhen
        condition={lineId != "13" && lineId != "50" && lineId != "96"}
      >
        <Text className="text-white text-2xl font-bold">{lineId}</Text>
      </VisibleWhen>
    </View>
  );
}
