import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface StockListItemProps {
  id: string;
  style: string;
  code: string;
  currentStock: number;
  photo: string;
  onPress?: () => void;
}

export const StockListItem: React.FC<StockListItemProps> = ({
  id,
  style,
  code,
  // openingStock,
  currentStock,
  photo,
  onPress,
}) => {
  const productImage = require("../assets/images/product.jpg");

  return (
    <TouchableOpacity
      className="bg-black-200 p-4 rounded-lg mb-3 flex-row items-center"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      <View className="mr-4">
        <Image
          source={photo !== null && photo !== "" ? {uri: photo} : productImage}
          className="w-12 h-12 rounded-lg"
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View className="flex-1">
        <Text className="text-white text-base font-pmedium mb-1">{style}</Text>
        <Text className="text-gray-400 text-sm">Code: {code}</Text>
      </View>

      {/* Price */}
      <View className="items-end">
        <Text className="text-primary text-lg font-pbold">{currentStock}</Text>
      </View>
    </TouchableOpacity>
  );
};
