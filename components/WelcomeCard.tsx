import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface WelcomeCardProps {
  userName: string;
  userImage?: any;
  onProfilePress?: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  userName,
  userImage,
  onProfilePress,
}) => {
  return (
    <View className="bg-black-200 p-4 py-6 rounded-lg mb-4 flex-row items-center">
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
        {userImage ? (
          <Image source={userImage} className="w-12 h-12 rounded-full" />
        ) : (
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
            <Ionicons name="person" size={24} color="#FDB714" />
          </View>
        )}
      </TouchableOpacity>

      <View className="flex-1 ml-3">
        <Text className="text-gray-400 text-md">Hello, {userName}</Text>
        <Text className="text-white text-xl font-pbold">Welcome Back</Text>
      </View>

      <TouchableOpacity className="p-2">
        <Ionicons name="notifications-outline" size={24} color="#FDB714" />
      </TouchableOpacity>
    </View>
  );
};
