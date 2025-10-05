import { useGlobalContext } from "@/context/GlobalProvider";
import { useAddTransactionMutation } from "@/store/api/transactionApi";
import { useWarehouseQuery } from "@/store/api/warehouseApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CashOut = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();
  
  const type = userInfo?.type
  
  const [createTransaction] = useAddTransactionMutation();

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: 0,
    note: "",
    invoice: "",
    photo: null as string | null,
    type: "cashOut",
    status: "complete",
    name: "",
    user: userInfo?.id,
    warehouse: userInfo?.warehouse,
    openingBalance: 0,
    currentBalance: 0,
    invoices: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data, isSuccess, isLoading, refetch } = useWarehouseQuery(
    userInfo?.warehouse,
  );

  // console.log(data);

  useEffect(() => {
    refetch();
  }, [userInfo]);

  useEffect(() => {
    if (data && isSuccess) {
      setFormData((prev) => ({
        ...prev,
        openingBalance: data?.currentBalance,
        currentBalance: data?.currentBalance,
      }));
    }
  }, [data, isSuccess]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create CashOut",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`,
      },
      //@ts-ignore
      headerTintColor: `#ffffff`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log("Date picker event:", event);
    console.log("Selected date:", selectedDate);

    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
      console.log("Date updated to:", selectedDate);

      // Close picker after selection
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
    }
  };

  const handleDatePress = () => {
    console.log("Opening date picker");
    setShowDatePicker(true);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "amount") {
      // Convert string to number for numeric fields
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
        currentBalance: parseInt(data?.currentBalance) - numValue,
      }));
    } else {
      // Handle string fields normally
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handlePhotoUpload = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload photos.",
          [{ text: "OK" }],
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setFormData((prev) => ({ ...prev, photo: selectedImage.uri }));
        console.log("Photo selected:", selectedImage.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos.",
          [{ text: "OK" }],
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const capturedImage = result.assets[0];
        setFormData((prev) => ({ ...prev, photo: capturedImage.uri }));
        console.log("Photo captured:", capturedImage.uri);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert("Photo Upload", "Choose how you want to add a photo", [
      {
        text: "Camera",
        onPress: handleCameraCapture,
      },
      {
        text: "Gallery",
        onPress: handlePhotoUpload,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  const handleSubmit = async () => {
    console.log("Transaction Form Data:", formData);
    console.log("Photo URI:", formData.photo);

    try {
      const response = await createTransaction(formData).unwrap();
      console.log("Transaction created:", response);
    } catch (error) {
      // console.error("Error creating transaction:", error);
    }
    router.back();

    // Alert.alert(
    //   "Success",
    //   "Form data logged to console. Check console for details.",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         setFormData({
    //           name: "",
    //           user: userInfo?.id,
    //           warehouse: userInfo?.warehouse,
    //           amount: 0,
    //           openingBalance: 0,
    //           currentBalance: 0,
    //           photo: "",
    //           invoices: "",
    //           note: "",
    //           date: new Date(),
    //           type: "cashOut",
    //           status: "complete",
    //           invoice: "",
    //         });
    //         router.back();
    //       },
    //     },
    //   ],
    // );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
    <SafeAreaView className="flex-1 bg-dark">
      <StatusBar style="light" />
      <ScrollView
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 300 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-gray-300 text-lg font-medium">Name</Text>
          <TextInput
            className="border  border-black-200 bg-black-200  rounded-lg p-4 text-lg text-white"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Enter name"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {/* Date Input */}
        <View className="mb-4">
          <Text className="text-gray-300 text-lg font-medium">Date</Text>
          <TouchableOpacity
            className="border border-black-200 bg-black-200 rounded-lg p-4 flex-row justify-between items-center"
            onPress={handleDatePress}
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg">
              {formatDate(formData.date)}
            </Text>
            <Ionicons name="calendar" size={24} color="#FDB714" />
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View className="mb-4">
          <Text className="text-gray-300 text-lg font-medium">Amount</Text>
          <TextInput
            className="border  border-black-200 bg-black-200  rounded-lg p-4 text-lg text-white"
            value={formData.amount.toString()}
            onChangeText={(value) => handleInputChange("amount", value)}
            placeholder="Enter amount"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* Note Input */}
        <View className="mb-4">
          <Text className="text-gray-300 text-lg font-medium">Note</Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            className="border  border-black-200 bg-black-200  rounded-lg p-4 text-base text-white min-h-[120px]"
            value={formData.note}
            onChangeText={(value) => handleInputChange("note", value)}
            placeholder="Enter transaction note..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* Invoice Input */}
        <View className="mb-4">
          <Text className="text-gray-300 text-lg font-medium">Invoice</Text>
          <TextInput
            className="border  border-black-200 bg-black-200  rounded-lg p-4 text-lg text-white"
            value={formData.invoice}
            onChangeText={(value) => handleInputChange("invoice", value)}
            placeholder="Enter invoice number"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Photo Upload */}
        <View className="mb-4">
          <Text className="text-gray-300 text-lg font-medium">
            Invoice Photo
          </Text>

          {formData.photo ? (
            <View className="border border-black-200 bg-black-200 rounded-lg p-4">
              <Image
                source={{ uri: formData.photo }}
                className="w-full h-48 rounded-lg mb-3"
                resizeMode="cover"
              />
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-red-600 p-3 rounded-lg"
                  onPress={removePhoto}
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-center font-medium">
                    Remove Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-primary p-3 rounded-lg"
                  onPress={showPhotoOptions}
                  activeOpacity={0.7}
                >
                  <Text className="text-black text-center font-medium">
                    Change Photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              className="border border-black-200 bg-black-200 rounded-lg p-6 flex-col justify-center items-center"
              onPress={showPhotoOptions}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={32} color="#FDB714" />
              <Text className="text-white text-lg mt-2 font-medium">
                Upload Photo
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center">
                Tap to select an image from your gallery
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="w-full bg-primary p-4 rounded-lg mt-8 mb-8"
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text className="text-black text-center font-bold text-lg ">
            Create Transaction
          </Text>
        </TouchableOpacity>
     

      {/* Date Picker Modal */}
      {showDatePicker && (
        <View className="absolute inset-0 bg-black/70 justify-center items-center z-50">
          <View className="bg-gray-900 rounded-2xl p-6 w-full border border-gray-700 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-800 rounded-xl p-4 mb-6">
              <DateTimePicker
                value={formData.date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(2020, 0, 1)}
                textColor="#ffffff"
                themeVariant="dark"
              />
            </View>

            {Platform.OS === "ios" && (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="w-52 bg-gray-700 p-4 rounded-xl border border-gray-600"
                  onPress={() => setShowDatePicker(false)}
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-300 text-center font-semibold text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-primary p-4 rounded-xl"
                  onPress={() => setShowDatePicker(false)}
                  activeOpacity={0.7}
                >
                  <Text className="text-black text-center font-bold text-lg">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
 
       </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CashOut;
