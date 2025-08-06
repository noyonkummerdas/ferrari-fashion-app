import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePickerField } from "../../../../components/DatePickerField";
import { ImageUploader } from "../../../../components/ImageUploader";

const UpdateStock = () => {
  const { id } = useLocalSearchParams();

  // Sample existing data (in real app, fetch by id)
  const [formData, setFormData] = useState({
    style: "Style Hood",
    code: `00${id}`,
    quantity: "50",
    date: "2024-01-01",
    image: null,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.style || !formData.code || !formData.quantity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Console log all form data
    console.log("=== UPDATE STOCK FORM DATA ===");
    console.log("Stock ID:", id);
    console.log("Style:", formData.style);
    console.log("Code:", formData.code);
    console.log("Quantity:", formData.quantity);
    console.log("Date:", formData.date);
    console.log("Image URI:", formData.image);
    console.log("Complete Form Data:", formData);
    console.log("===============================");

    Alert.alert("Success", "Stock item updated successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-pbold mb-2">
            Update Stock Item
          </Text>
          <Text className="text-gray-400">
            Modify the details of your inventory item
          </Text>
        </View>

        {/* Form */}
        <View className="bg-black-200 p-4 rounded-lg mb-6">
          {/* Styles Input */}
          <View className="mb-4">
            <Text className="text-white text-base font-pmedium mb-2">
              Styles <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-black-200 border border-gray-600 p-4 rounded-lg flex-row items-center">
              <Ionicons
                name="shirt"
                size={20}
                color="#9CA3AF"
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-white text-base"
                value={formData.style}
                onChangeText={(value) => handleInputChange("style", value)}
                placeholder="Enter style name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Code Input */}
          <View className="mb-4">
            <Text className="text-white text-base font-pmedium mb-2">
              Code <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-black-200 border border-gray-600 p-4 rounded-lg flex-row items-center">
              <Ionicons
                name="barcode"
                size={20}
                color="#9CA3AF"
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-white text-base"
                value={formData.code}
                onChangeText={(value) => handleInputChange("code", value)}
                placeholder="Enter product code"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Quantity Input */}
          <View className="mb-4">
            <Text className="text-white text-base font-pmedium mb-2">
              Qty <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-black-200 border border-gray-600 p-4 rounded-lg flex-row items-center">
              <Ionicons
                name="cube"
                size={20}
                color="#9CA3AF"
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-white text-base"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange("quantity", value)}
                placeholder="Enter quantity"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Date Picker */}
          <DatePickerField
            label="Date"
            value={formData.date}
            onChange={(date) => handleInputChange("date", date)}
            required
          />
        </View>

        {/* Media Upload */}
        <ImageUploader
          image={formData.image}
          onImageSelected={(uri) => handleInputChange("image", uri)}
        />

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity
            className="flex-1 bg-gray-600 p-4 rounded-lg flex-row items-center justify-center"
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="close-outline" size={20} color="#ffffff" />
            <Text className="text-white font-pbold ml-2">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary p-4 rounded-lg flex-row items-center justify-center"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-outline" size={20} color="#000000" />
            <Text className="text-black font-pbold ml-2">Update Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UpdateStock;
