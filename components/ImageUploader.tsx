import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface ImageUploaderProps {
  image: string | null;
  onImageSelected: (uri: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  onImageSelected,
}) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onImageSelected(null);
  };

  return (
    <View className="mb-6">
      <Text className="text-white text-lg font-pbold mb-4">Media Upload</Text>
      <Text className="text-gray-400 text-sm mb-4">
        Add your documents here, and you can upload up to 5 files
      </Text>

      <View className="border-2 border-dashed border-gray-600 rounded-lg p-8 items-center">
        {image ? (
          <View className="items-center">
            <Image
              source={{ uri: image }}
              className="w-24 h-24 rounded-lg mb-4"
            />
            <Text className="text-white text-sm mb-4">Image selected</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="bg-primary px-4 py-2 rounded-lg"
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Text className="text-black font-pmedium">Change Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 px-4 py-2 rounded-lg"
                onPress={removeImage}
                activeOpacity={0.8}
              >
                <Text className="text-white font-pmedium">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="items-center">
            <View className="bg-blue-600 p-4 rounded-lg mb-4">
              <Ionicons name="cloud-upload" size={32} color="#ffffff" />
            </View>
            <Text className="text-white text-base font-pmedium mb-2">
              upload JPG image
            </Text>
            <View className="w-32 h-1 bg-gray-600 rounded mb-4">
              <View className="w-0 h-1 bg-primary rounded" />
            </View>
            <TouchableOpacity
              className="bg-white px-6 py-3 rounded-lg"
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Text className="text-black font-pmedium">Browse files</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
