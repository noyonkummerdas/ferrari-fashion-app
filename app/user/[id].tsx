import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
   KeyboardAvoidingView,
} from "react-native";

import CustomDropdown from "@/components/CustomDropdown";
import { useUpdateUserMutation, useUserQuery } from "@/store/api/userApi";
import { useWarehousesQuery } from "@/store/api/warehouseApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import profile from "../../assets/images/profile.jpg";
import { useGlobalContext } from "@/context/GlobalProvider";
import ExpoPhotoUploader from "@/components/PhotoUpload";
import photo from "@/assets/images/profile.jpg";


const updateUser = () => {
  const { userInfo } = useGlobalContext();
  const { id } = useLocalSearchParams();


  // console.log("ID", id);

  // const warehouse = userInfo?.warehouse;
  const [isPhoto, setIsPhoto] = useState(false);

  const [warehouse, setWarehouse] = useState([
    {
      label: "Select Warehouse",
      value: "",
    },
  ]);

  const {
    data: userData,
    isSuccess: isUseSeccess,
    refetch: userRefetch,
  } = useUserQuery({ _id: id });

  useEffect(() => {
    userRefetch();
  }, [id]);

  useEffect(() => {
    if (isUseSeccess) {
      setForm(userData);
    }
  }, [isUseSeccess, userData]);

  // console.log("USER DATA", userData, isUseSeccess);

  const [updateUser] = useUpdateUserMutation();

  const [type, setType] = useState([
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
  ]);
  const [status, setStatus] = useState([
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]);

  const { data, isSuccess, isError, isLoading } = useWarehousesQuery();

  // console.log("WAREHOUSE DATA", data);
  useEffect(() => {
    if (isSuccess) {
      setWarehouse(
        data?.map((item) => ({ label: item?.name, value: item?._id })),
      );
    }
  }, [isSuccess, data]);

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
      headerRight: () => {userInfo?.type === 'Admin' &&
              <TouchableOpacity
                onPress={() => router.push(`/user/permission/${id}`)}
                className="me-4"
              >
                <Text className="text-black bg-primary rounded-lg ms-2 p-2 text-semibold">Permission</Text>
                {/* <Ionicons name="create-outline" size={28} color="white" /> */}

              </TouchableOpacity>
      },
      title: "Update User",
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
    _id: id as string,
    name: "",
    email: "",
    username: "",
    password: "",
    type: "manager",
    photo: "",
    phone: "",
    status: "active",
    warehouse: "",
  });

  // console.log("User DATA", form);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  useEffect(() => {
    handleInputChange("username", form?.phone);
  }, [form?.phone]);

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

  const handleUpdateUser = async () => {
    try {
      console.log("FORM DATA", form);
      const response = await updateUser(form).unwrap();
      console.log("Responce", response);
      router.back();
    } catch (error) {
      console.error("Error adding User:", error);
    }
  };

  return (
     <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
    <ScrollView className="flex-1 bg-dark p-4 mx-auto w-full"
                  className="flex-1 px-6 pt-4"
                 contentContainerStyle={{ paddingBottom: 300 }}
               keyboardShouldPersistTaps="handled"
               showsVerticalScrollIndicator={false}
                >
      <StatusBar style="light" />
      <View>
        <TouchableOpacity
          onPress={pickImage}
          className="flex justify-center items-center"
        >
          <Image source={profile} className="w-40 h-40 rounded-full" />
        </TouchableOpacity>

          {/* <ExpoPhotoUploader
          uploadSuccess={(url) => setForm({ ...form, photo: url })}
          folderName="ffapp"
          placeholder={photo}
          // existingPhoto={}
        /> */}

      </View>

      <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
        Name
      </Text>
      <TextInput
        placeholder="User Name"
        value={form.name}
        onChangeText={(value) => handleInputChange("name", value)}
        className="border placeholder:text-gray-500 bg-black-200 rounded-full p-4 mb-3 text-gray-200"
      />
      <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
        Phone
      </Text>
      <TextInput
        placeholder="Phone number"
        value={form.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
        className="border placeholder:text-gray-500 bg-black-200 rounded-full p-4 mb-3 text-gray-200"
      />
      <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
        Password
      </Text>
      <TextInput
        placeholder="Password"
        value={form.password}
        secureTextEntry={true}
        onChangeText={(value) => handleInputChange("password", value)}
        className="border placeholder:text-gray-500 bg-black-200 rounded-full p-4 mb-3 text-gray-200"
      />
      <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
        Email
      </Text>
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleInputChange("email", value)}
        className="border placeholder:text-gray-500 bg-black-200 rounded-full p-4 mb-3 text-gray-200"
      />
      <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
        Warehouse
      </Text>
      <CustomDropdown
        data={warehouse}
        value={form.warehouse}
        setValue={(value) => handleInputChange("warehouse", value)}
        placeholder="Select Warehouse"
        mode="modal"
        search={false}
      />

      <View className="flex flex-row gap-2 justify-center ms-[-25px]  ">
        <View className="w-[160px]">
          <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
            Type
          </Text>
          <CustomDropdown
            data={type}
            value={form.type}
            placeholder="Type"
            mode="modal"
            setValue={(value) => handleInputChange("type", value)}
          />
        </View>

        <View className="w-[160px]">
          <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
            Status
          </Text>
          <CustomDropdown
            data={status}
            value={form.status}
            placeholder="Status"
            mode="modal"
            search={false}
            setValue={(value) => handleInputChange("status", value)}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleUpdateUser}
        className="h-14 justify-center items-center rounded-full bg-primary mt-2"
      >
        <Text className="text-white text-center text-md font-pmedium">
          Update User
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default updateUser;