import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownFieldProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const CustomDropdownField: React.FC<CustomDropdownFieldProps> = ({
  label,
  value,
  onSelect,
  options,
  placeholder = "Select an option",
  required = false,
  icon,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <View className="mb-4">
      <Text className="text-white text-base font-pmedium mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      <TouchableOpacity
        className="bg-black-200 p-4 rounded-lg flex-row items-center justify-between"
        onPress={() => setIsVisible(true)}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center flex-1">
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#9CA3AF"
              style={{ marginRight: 12 }}
            />
          )}
          <Text
            className={`text-base ${selectedOption ? "text-white" : "text-gray-400"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-black-200 rounded-t-2xl max-h-96">
            <View className="p-4 border-b border-gray-600">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-lg font-pbold">{label}</Text>
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="max-h-80">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`p-4 border-b border-gray-700 ${
                    value === option.value ? "bg-primary/10" : ""
                  }`}
                  onPress={() => {
                    onSelect(option.value);
                    setIsVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base ${
                      value === option.value
                        ? "text-primary font-pmedium"
                        : "text-white"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
