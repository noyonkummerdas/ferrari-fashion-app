import { useGlobalContext } from "@/context/GlobalProvider";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import profile from "../../assets/images/profile.jpg";

const updateCustomer = () => {
  const { userInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const [isPhoto, setIsPhoto] = useState(false);
  const { id } = useLocalSearchParams();

  const [updateCustomer] = useUpdateCustomerMutation();

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
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useGetCustomerByIdQuery({
      id: id,
      forceRefetch: true,
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="me-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
      title: "Update Customer",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`, //`${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      //@ts-ignore
      headerTintColor: `#ffffff`, //`${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "left",
      headerShown: true,
    });
  }, [navigation]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    photo: "",
    company: "",
    status: "active",
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

  useEffect(() => {
    setForm({
      ...form,
      _id: id,
      name: data?.name || "",
      email: data?.email || "",
      company: data?.company || "",
      phone: data?.phone || "",
      photo: "",
      address: data?.address || "",
      status: data?.status || "active",
    });
  }, [data, isSuccess]);

  useEffect(() => {
    refetch();
  }, [id]);
  // console.log("FORM DATA",data)
  // console.log("ID",data)

  const handleCreateCustomer = async () => {
    try {
      const response = await updateCustomer(form).unwrap();
      console.log("Customer Update successfully:", response);
      router.back();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-dark p-6">
      <View>
        <TouchableOpacity
          onPress={pickImage}
          className="flex justify-center items-center mb-2"
        >
          <Image source={profile} className="w-32 h-32 rounded-full" />
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

      <TouchableOpacity
        onPress={handleCreateCustomer}
        className="h-14 justify-center items-center rounded-full bg-primary mt-4"
      >
        <Text className="text-dark text-center text-lg font-pmedium">
          Update Customer
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default updateCustomer;
