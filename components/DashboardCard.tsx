import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DashboardCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  onPress?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  iconName,
  bgColor = "bg-black-200",
  textColor = "text-white",
  iconColor = "#FDB714",
  onPress,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      className={`${bgColor} p-4 rounded-lg flex-row items-center justify-between mb-3`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="flex-1">
        <Text className={`${textColor} text-sm opacity-80 mb-1`}>{title}</Text>
        <Text className={`${textColor} text-xl font-psemibold`}>{value}</Text>
      </View>
      <View className="bg-primary/10 p-3 rounded-lg">
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
    </CardWrapper>
  );
};
