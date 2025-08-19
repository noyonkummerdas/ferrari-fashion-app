import { useColorScheme } from "@/hooks/useColorScheme.web";
// import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
// import { useColorScheme } from "react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Accounts = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     // headerRight: () => (
  //     // <View className='me-4' >
  //     //     <TouchableOpacity onPress={()=>setIsPhoto(!isPhoto)} className='flex flex-row justify-center items-center gap-2'>
  //     //       <Ionicons name={isPhoto ? "image-sharp" : "image-outline"} size={24}  color="#f2652d" />
  //     //       <Text className='text-primary text-xl font-pmedium'>Photo</Text>
  //     //     </TouchableOpacity>
  //     // </View>
  //     // ),
  //     title: "Accounts",
  //     //@ts-ignore
  //     headerStyle: {
  //       backgroundColor: `#000000`,
  //     },
  //     headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
  //     //@ts-ignore
  //     headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
  //     headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
  //     headerShadowVisible: false,
  //     headerTitleAlign: "center",
  //     headerShown: true,
  //   });
  // }, [navigation]);

  return (
    <ScrollView
      className="flex-1 bg-black-700 p-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Row 1 */}
      <View className="flex-row mb-4">
        <TouchableOpacity
          className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center mr-2"
          activeOpacity={0.8}
          onPress={() => router.push("/(account)/cashDeposit")}
        >
          <Ionicons name="wallet" size={28} color="#FDB714" />
          <Text className="text-white text-base mt-2">Cash Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center ml-2"
          activeOpacity={0.8}
          onPress={() => router.push("/(account)/cashOut")}
        >
          <Ionicons name="card" size={28} color="#FDB714" />
          <Text className="text-white text-base mt-2">Cash Out</Text>
        </TouchableOpacity>
      </View>
      {/* Row 2 */}
      <View className="flex-row mt-4">
        <TouchableOpacity
          className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center mr-2"
          activeOpacity={0.8}
          onPress={() => router.push("/(account)/payment")}
        >
          <Ionicons name="cash" size={28} color="#FDB714" />
          <Text className="text-white text-base mt-2">Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center ml-2"
          activeOpacity={0.8}
          onPress={() => router.push("/(account)/received-payment/")}
        >
          <Ionicons name="checkmark-done-circle" size={28} color="#FDB714" />
          <Text className="text-white text-base mt-2">Received Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions Summary Cards */}
      <View className="mt-4">
        <Text className="text-white text-lg font-pbold mb-4 mt-2">
          Transactions
        </Text>

        {/* Top balances */}
        <View className="flex-row mb-4 w-full">
          <View className="flex-1 bg-black-200 rounded-xl h-28 p-4 mr-2 border border-gray-700">
            <View className="flex-row items-center justify-between mb-1 px-1">
              <Ionicons name="trending-up" size={18} color="#86EFAC" />
              <Text className="text-gray-300">Opening Balance</Text>
            </View>
            <Text className="text-white text-xl font-pbold">0.00</Text>
          </View>
          <View className="flex-1 ml-2 bg-black-200 rounded-xl h-28 p-4 border border-gray-700">
            <View className="flex-row items-center justify-between mb-1 px-1">
              <Ionicons name="wallet" size={18} color="#FDB714" />
              <Text className="text-gray-300">Current Balance</Text>
            </View>
            <Text className="text-white text-xl font-pbold">0.00</Text>
          </View>
        </View>

        <View className="flex-row mb-4">
          {/* Payment */}
          <TouchableOpacity 
          onPress={() => router.push("/(account)/paymentList")}
          className="flex-1 bg-black-200 rounded-xl p-4 h-28 mr-2 border border-gray-700">
            <View className="flex-row items-center mb-2 px-1">
              <Ionicons name="cash" size={18} color="#60A5FA" />
              <Text className="text-gray-300">Payment</Text>
            </View>
            <Text className="text-white text-xl font-pbold">0.00</Text>
          </TouchableOpacity>
          
          {/* Payment Received */}
          <TouchableOpacity 
            onPress={() => router.push("/(account)/paymentReceivedList")}
          className="flex-1 bg-black-200 rounded-xl p-4 h-28 ml-2 border border-gray-700">
            <View className="flex-row items-center mb-2 px-1 ">
              <Ionicons name="checkmark-done-circle" size={18} color="#86EFAC" />
              <Text className="text-gray-300">Payment Received</Text>
            </View>
            <Text className="text-white text-xl font-pbold">0.00</Text>
          </TouchableOpacity>
        </View>
          
        <View className="flex-row mb-4">
          {/* Cash Out */}
          <TouchableOpacity 
          onPress={() => router.push("/(account)/cashOutList")}
          className="flex-1 bg-black-200 rounded-xl p-4 h-28 mr-2 border border-gray-700">
            <View className="flex-row items-center mb-2 px-1 ">
              <Ionicons name="arrow-up-circle" size={18} color="#F87171" />
              <Text className="text-gray-300">Cash Out</Text>
            </View>
            <Text className="text-white text-xl font-pbold">0.00</Text>
          </TouchableOpacity>
          
          {/* Cash In */}
          <TouchableOpacity 
            onPress={() => router.push("/(account)/cashDepositList")}
          className="flex-1 bg-black-200 rounded-xl p-4 h-28 ml-2 border border-gray-700">
            <View className="flex-row items-center mb-2 px-1">
              <Ionicons name="arrow-down-circle" size={18} color="#34D399" />
              <Text className="text-gray-300">Cash In</Text>
            </View>
            <Text className="text-white text-xl font-pbold">0.00</Text>
          </TouchableOpacity>
        </View>
          
              </View>
            </ScrollView>
  );
};

export default Accounts;
