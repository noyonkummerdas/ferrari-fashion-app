import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

const cashDepositDetails = () => {



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
          title: "Cash Deposit Details",
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



      const cashDepositDetails=[
        {
            id: 1,
            name: "John Doe",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 2,
            name: "Jane Smith",
            amount: 2000,
            date: "2023-10-02",
        },
        {
            id: 3 ,
            name: "Alice Johnson",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 4,
            name: "Bob Brown",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 5,
            name: "Charlie Davis",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 6,
            name: "David Wilson",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 7,
            name: "Emma Thompson",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 8,
            name: "Frank Harris",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            id: 9,
            name: "George Martin",
            amount: 1000,
            date: "2023-10-01",
        },
      ]
    return (
       <>
        {cashDepositDetails?.map((item) => (
          <View key={item.id} 
          className="mt-4">
                    <Text className="text-base font-medium text-primary">{item.name}</Text>
                    <View className="flex flex-row items-center justify-between">
                    <Text className="text-sm text-gray-200">{item.date}</Text>
                    <Text className="text-lg text-primary">{item.amount} <Text className="text-white">BDT</Text></Text>
                    </View>
          </View>
        ))}
       </>
    );
};

export default cashDepositDetails;
