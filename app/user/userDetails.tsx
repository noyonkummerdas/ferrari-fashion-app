import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import React, { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import profile from "../../assets/images/profile.jpg"; // dummy image

const UserDetails = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // Dummy user data (পরে API থেকে আনতে পারবা)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+8801712345678",
    type: "Manager",
    status: "Active",
    warehouse: "Dhaka Warehouse",
    photo: "",
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity
            className="flex flex-row gap-2 items-center"
            onPress={() => router.push(`/user/${user._id}`)}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
            <Text className="text-white text-xl font-pmedium">Update</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "User Details",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation, colorScheme]);

  return (
    <ScrollView className="flex-1 bg-dark p-6">
      {/* Profile Image */}
      <View className="items-center my-4">
        <Image
          source={user.photo ? { uri: user.photo } : profile}
          className="w-36 h-36 rounded-full border-4 border-primary"
        />
        <Text className="text-white text-2xl font-bold mt-3">{user.name}</Text>
        <Text className="text-gray-400 text-base">{user.type}</Text>
      </View>

      {/* Details Card */}
      <View className="bg-black-200 rounded-2xl p-5 mt-4 shadow">
        <DetailRow label="Email" value={user.email} icon="mail-outline" />
        <DetailRow label="Phone" value={user.phone} icon="call-outline" />
        <DetailRow label="Warehouse" value={user.warehouse} icon="business-outline" />
        <DetailRow label="Status" value={user.status} icon="checkmark-circle-outline" />
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => router.push("/user/update-user")}
        className="h-14 justify-center items-center rounded-full bg-primary mt-6"
      >
        <Text className="text-white text-lg font-semibold">Edit User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 🔹 Reusable Row Component
const DetailRow = ({ label, value, icon }) => (
  <View className="flex-row items-center py-3 border-b border-gray-700">
    <Ionicons name={icon} size={22} color="#38bdf8" style={{ marginRight: 10 }} />
    <View>
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-base font-medium">{value}</Text>
    </View>
  </View>
);

export default UserDetails;

const styles = StyleSheet.create({});
