import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth * 0.4; // Each card takes 40% of screen width

interface StatItemProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export const StatItem: React.FC<StatItemProps> = ({
  title,
  value,
  iconName,
  onPress,
}) => {
  const ItemWrapper = onPress ? TouchableOpacity : View;

  return (
    <ItemWrapper
      className="bg-black-200 p-4 rounded-lg mr-3"
      style={{
        width: cardWidth,
        height: cardWidth, // Make it square
        minHeight: 120,
      }}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Icon at top left */}
      <View className="flex-row justify-start mb-2">
        <View className="bg-primary/10 p-2 rounded-lg">
          <Ionicons name={iconName} size={20} color="#FDB714" />
        </View>
      </View>
      {/* Title at bottom */}
      <View className="justify-end">
        <Text className="text-gray-400 text-xs leading-3">{title}</Text>
      </View>

      {/* Value - large number */}
      <View className="flex-1 justify-center">
        <Text className="text-white text-3xl font-pbold mb-1">{value}</Text>
      </View>
    </ItemWrapper>
  );
};

interface StatsGridProps {
  stats: {
    title: string;
    value: string | number;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
  }[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        className="flex-row"
      >
        {stats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </ScrollView>
    </View>
  );
};
