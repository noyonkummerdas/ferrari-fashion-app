import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const CashOutDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();

  // date formatting
  const today = new Date();
  const formattedDate = {
    day: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }),
    year: today.getFullYear(),
  };
  const formattedDateString = `${formattedDate.day} ${formattedDate.month}, ${formattedDate.year}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cash Out Details",
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
        <TouchableOpacity onPress={() => router.back('/')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      <ScrollView className="flex-1 bg-black-700 p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-black-200 rounded-xl p-4 border border-gray-700">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-300">Date</Text>
            <Text className="text-white font-psemibold">{formattedDateString}</Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-300">Reference</Text>
            <Text className="text-white font-psemibold">—</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-300">Amount</Text>
            <Text className="text-primary text-lg font-pbold">0.00</Text>
          </View>
        </View>

        <View className="bg-black-200 rounded-xl p-4 mt-4 border border-gray-700">
          <Text className="text-white text-lg font-pbold mb-3">Details</Text>
          <View className="flex-row items-center justify-between py-2 border-b border-gray-700">
            <Text className="text-gray-300">Depositor</Text>
            <Text className="text-white">—</Text>
          </View>
          <View className="flex-row items-center justify-between py-2 border-b border-gray-700">
            <Text className="text-gray-300">Payment Method</Text>
            <Text className="text-white">Cash</Text>
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-gray-300">Notes</Text>
            <Text className="text-white">—</Text>
          </View>
        </View>

        <TouchableOpacity 
        onPress={()=>router.push('/account/cashDeposit/Id')}
        >

          <Text className="text-gray-200">
                update diposti
          </Text>

        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default CashOutDetails;
