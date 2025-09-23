import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useAddCustomerMutation } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import profile from "../../assets/images/profile.jpg";
import { Platform } from "react-native";

const AddCustomer = () => {
  const { userInfo } = useGlobalContext();
  // const type = userInfo?.type;
  const warehouse = userInfo?.warehouse;
  const [isPhoto, setIsPhoto] = useState(false);

  // console.log("WAREHOUSE", warehouse);

  const [addNewCustomer] = useAddCustomerMutation();

  const [gender, setGender] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);
  const [status, setStatus] = useState([
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]);

  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Add Customer",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
    photo: "",
    balance: "",
    company: "",
    status: "active",
    warehouse: warehouse,
  });

  // console.log("CUSTOMER DATA", form);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, photo: result.assets[0].uri });
    }
  };

  const handleCreateCustomer = async () => {
    // console.log("FORM", "clicked");
    try {
      if (
        form.name === "" ||
        form.phone === "" ||
        form.email === "" ||
        form.address === "" ||
        form.balance === ""
      ) {
        Alert.alert("Please fill all the fields");
        return;
      }
      // console.log("FORM", form);
      const response = await addNewCustomer(form).unwrap();
      console.log("Customer added successfully:", response);
      router.back();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
    <ScrollView className="flex-1 bg-dark p-4">
      <View>
        <TouchableOpacity
          onPress={pickImage}
          className="flex justify-center items-center mb-2"
        >
          <Image source={profile} className="w-40 h-40 rounded-full" />
        </TouchableOpacity>
      </View>
      <Text className="text-white text-md font-regular">Customer name</Text>
      <TextInput
        placeholder="Customer Name"
        value={form.name}
        onChangeText={(value) => handleInputChange("name", value)}
        className="border bg-black-200 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />
      <Text className="text-white text-md font-regular">Phone </Text>

      <TextInput
        placeholder="Phone no"
        value={form.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
        className="border bg-black-200 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />

      <Text className="text-white text-md font-regular">Email </Text>
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleInputChange("email", value)}
        className="border bg-black-200 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />
      <Text className="text-white text-md font-regular">Company name </Text>
      <TextInput
        placeholder="Company name"
        value={form.company}
        onChangeText={(value) => handleInputChange("company", value)}
        className="border bg-black-200 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />
      <Text className="text-white text-md font-regular">Address </Text>
      <TextInput
        placeholder="Address"
        value={form.address}
        onChangeText={(value) => handleInputChange("address", value)}
        className="border bg-black-200 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />
      <Text className="text-white text-md font-regular">Opening balance </Text>
      <TextInput
        placeholder="Opening balance"
        value={form.balance}
        onChangeText={(value) => handleInputChange("balance", value)}
        className="border bg-black-200  rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />

      <TouchableOpacity
        onPress={handleCreateCustomer}
        className="h-14 justify-center items-center rounded-full bg-primary mt-2"
      >
        <Text className="text-black-200 text-center text-md font-regular">
          Add Customer
        </Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

export default AddCustomer;
