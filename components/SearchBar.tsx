import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search products...",
  onClear,
}) => {
  return (
    <View className="bg-black-200 rounded-lg flex-row items-center px-4 py-3 mb-4">
      {/* Search Icon */}
      <Ionicons name="search" size={20} color="#FDB714" className="mr-3" />

      {/* Text Input */}
      <TextInput
        className="flex-1 text-white text-base font-pregular"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear || (() => onChangeText(""))}
          className="ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};
