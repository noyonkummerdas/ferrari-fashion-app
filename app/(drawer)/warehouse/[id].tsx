import CustomDropdown from "@/components/CustomDropdown";
import { Colors } from "@/constants/Colors";
import {
  useUpdateWarehouseMutation,
  useWarehouseQuery,
} from "@/store/api/warehouseApi"; // ✅ change to your actual import
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const WarehouseEdit = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const { id } = useLocalSearchParams();

  // console.log("ID:", id);

  const { data, isError, isSuccess, refetch } = useWarehouseQuery(id as string);

  // console.log("WAREHOUSE:", data, isError, isSuccess, refetch);

  useEffect(() => {
    if (isSuccess) {
      setForm(data);
    }
  }, [isSuccess, data]);

  // ✅ RTK Query mutation hook
  const [updateWarehouse] = useUpdateWarehouseMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Warehouse ${data?.name}`,
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      headerLeft: () => (
        <Link href="/warehouse" className="ms-2">
          {" "}
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
      ),

      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: true,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation, data]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    type: "outlet",
    phone: "",
    status: "active",
  });
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        address: data.address || "",
        type: data.type || "outlet",
        phone: data.phone || "",
        status: data.status || "active",
      });
    }
  }, [data]);

  // Warehouse type options for dropdown
  const warehouseTypes = [
    { label: "Outlet", value: "outlet" },
    { label: "Office", value: "office" },
    { label: "Factory", value: "factory" },
  ];

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCreateCustomer = async () => {
    try {
      console.log("WAREHOUSE:", form);
      if (form.name === "" || form.phone === "" || form.address === "") {
        Alert.alert("Please fill all the fields");
        return;
      }
      const response = await updateWarehouse(form).unwrap();
      console.log("Warehouse added:", response);
      router.push("/warehouse");
    } catch (error) {
      console.error("Error adding warehouse:", error);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="bg-dark p-4 ">
        <View className="flex flex-col justify-center  w-full mb-4">
          {/* Name */}
          <Text className="text-gray-200 font-regular text-lg  ms-3">Name</Text>
          <TextInput
            placeholder="Name"
            value={form.name}
            onChangeText={(value) => handleInputChange("name", value)}
            className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
          />

          {/* Phone */}
          <Text className="text-gray-200 font-regular text-lg ms-3">
            Phone number
          </Text>
          <TextInput
            placeholder="Phone number"
            value={form.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
          />

          {/* Address */}
          <Text className="text-gray-200 font-regular text-lg  ms-3">
            Address
          </Text>
          <TextInput
            placeholder="Address"
            value={form.address}
            onChangeText={(value) => handleInputChange("address", value)}
            className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
          />

          {/* Type */}
          <Text className="text-gray-200 placeholder:text-gray-500 font-regular text-lg ms-3">
            Type
          </Text>
          <CustomDropdown
            data={warehouseTypes}
            value={form.type}
            setValue={(value) => handleInputChange("type", value)}
            placeholder="Select warehouse type"
            mode="modal"
            search={false}
          />

          {/* Submit Button */}
        </View>
        <View className="flex-row w-full justify-between mt-2 gap-3">
          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleCreateCustomer}
            className="h-14 justify-center flex-1 items-center rounded-lg bg-primary mt-8"
          >
            <Text className="text-white text-center text-lg font-pmedium">
              Update
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => router.push("/warehouse")}
            className="h-14 justify-center flex-1 items-center rounded-lg bg-black-200 mt-8"
          >
            <Text className="text-white text-center text-lg font-pmedium">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};
export default WarehouseEdit;
