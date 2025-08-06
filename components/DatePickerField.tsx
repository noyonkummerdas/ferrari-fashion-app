import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface DatePickerFieldProps {
  label: string;
  value: string; // ISO date string
  onChange: (date: string) => void;
  required?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      const isoString = selectedDate.toISOString().split("T")[0];
      onChange(isoString);
    }
  };

  const handleClosePicker = () => {
    setShowPicker(false);
  };

  return (
    <View className="mb-4">
      <Text className="text-white text-base font-pmedium mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      <View className="bg-black-200 border border-gray-600 p-4 rounded-lg flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="bg-primary p-2 rounded mr-3">
            <Ionicons name="calendar" size={16} color="#000000" />
          </View>
          <Text className="text-white text-base font-pmedium">
            {formatDate(value)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowPicker(!showPicker)}
          className="p-2"
          activeOpacity={0.8}
        >
          <Ionicons
            name={showPicker ? "close" : "chevron-down"}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <View className="mt-2">
          {Platform.OS === "ios" ? (
            <View className="bg-black-200 border border-gray-600 rounded-lg p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-base font-pmedium">
                  Select Date
                </Text>
                <TouchableOpacity
                  onPress={handleClosePicker}
                  className="p-2"
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={20} color="#FDB714" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={new Date(value)}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor="#ffffff"
                themeVariant="dark"
              />
            </View>
          ) : (
            <DateTimePicker
              value={new Date(value)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
      )}
    </View>
  );
};
