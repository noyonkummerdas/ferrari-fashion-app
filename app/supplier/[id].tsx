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
  useSupplierQuery,
  useUpdateSupplierMutation,
} from "@/store/api/supplierApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import profile from "../../assets/images/profile.jpg";

const UpdateSupplier = () => {
  const { userInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const [isPhoto, setIsPhoto] = useState(false);
  const { id } = useLocalSearchParams();

  const [updateSupplier] = useUpdateSupplierMutation();

  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSupplierQuery({
      _id: id,
      // aamarId,
      forceRefetch: true,
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Update Supplier",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`,
      },
      //@ts-ignore
      headerTintColor: `#ffffff`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "left",
      headerShown: true,
    });
  }, [navigation, isPhoto]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    code: "",
    company: "",
    address: "",
    phone: "",
    status: "active",
    warehouse: warehouse,
  });

  console.log("SUPPLIER DATA", form);

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
      // code: data?.code || "",
      email: data?.email || "",
      company: data?.company || "",
      phone: data?.phone || "",
      photo: "",
      address: data?.address || "",
      // balance: data?.balance || "",
      status: data?.status || "active",
    });
  }, [data, isSuccess]);

  useEffect(() => {
    refetch();
  }, [id]);
  // console.log("FORM DATA",form)
  // console.log("ID",data)/

  const handleUpdareSupplier = async () => {
    try {
      const response = await updateSupplier(form).unwrap();
      console.log("Supplier Update successfully:", response);
      router.back();
    } catch (error) {
      console.error("Error adding Supplier:", error);
    }
  };

  return (
    <>
    <ScrollView className="flex-1 bg-dark p-6">
      <StatusBar style="light" backgroundColor="#000000" />
      <View>
        <TouchableOpacity
          onPress={pickImage}
          className="flex justify-center items-center mb-2"
        >
          <Image source={profile} className="w-32 h-32 rounded-full" />
        </TouchableOpacity>
      </View>

      <Text className="text-white text-md font-regular">Supplire name</Text>
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
      {/* <Text className="text-white text-md font-regular">Opening balance </Text>
      <TextInput
        placeholder="Opening balance"
        value={form.balance}
        onChangeText={(value) => handleInputChange("balance", value)}
        className="border bg-black-200  rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      /> */}

      <TouchableOpacity
        onPress={handleUpdareSupplier}
        className="h-14 justify-center items-center rounded-full bg-primary mt-4"
      >
        <Text className="text-dark text-center text-lg font-pmedium">
          Update Supplier
        </Text>
      </TouchableOpacity>
    </ScrollView>

    </>
  );
};

export default UpdateSupplier;
