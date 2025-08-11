import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const Profile = () => {
  const router = useRouter();
  const { userInfo } = useGlobalContext();

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout pressed");
  };

  const handleEditProfile = () => {
    // Add edit profile logic here
    console.log("Edit profile pressed");
  };

  return (
    <SafeAreaView className="bg-dark flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Profile</Text>
        <View className="w-6" />
      </View>

      {/* Profile Card */}
      <View className="mx-4 mb-6 bg-black-200 rounded-lg p-4">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-orange-500 items-center justify-center mr-4">
            <Ionicons name="person" size={32} color="#ffffff" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-yellow-400 text-lg font-bold mr-2">{userInfo?.name || "NK Noyon"}</Text>
              <Text className="text-white text-sm">(Admin)</Text>
            </View>
            <Text className="text-white text-sm">{userInfo?.email || "nknoyon01936@gmail.com"}</Text>
          </View>
          <TouchableOpacity onPress={handleEditProfile}>
            <Ionicons name="pencil" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View className="mb-6 bg-black-200 rounded-lg p-4">
          <Text className="text-white text-lg font-bold mb-3">Account</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Notification</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="mail" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Email Preference</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="wallet" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Payment</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="refresh-circle" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>
        </View>

        {/* Action Section */}
        <View className="mb-6 bg-black-200 rounded-lg p-4">
          <Text className="text-white text-lg font-bold mb-3">Action</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="key" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Active Log</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="business" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Switch Warehouse</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View className="mb-6 bg-black-200 rounded-lg p-4">
          <Text className="text-white text-lg font-bold mb-3">Support</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-3"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="help-circle" size={20} color="#fdb714" />
              <Text className="text-white text-base ml-3">Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fdb714" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
