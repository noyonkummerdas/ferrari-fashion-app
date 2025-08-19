import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

const CashOutList = () => {



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
          title: "Cash Out List",
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



      const depositList=[
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
       const [search, setSearch] = useState("");
                const filteredList = depositList.filter(
                  (item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.amount.toString().includes(search) ||
                    item.date.includes(search)
                );
    return (
       <>
          <View className="mt-2 mb-2">
              <View className="bg-zinc-800 rounded-xl flex-row items-center px-3 py-2">
                
                <TextInput
                  className="ml-2 flex-1 text-white"
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by name, amount, or date"
                  placeholderTextColor="#d1d5db"
                  style={{ backgroundColor: 'transparent', color: 'primary', borderWidth: 0, width: '100%' }}
                />
                <Ionicons name="search" size={20} color="#fdb714" />
              </View>
            </View>

        {depositList?.map((item) => (
          <View key={item.id} 
          className="mt-4">
                <TouchableOpacity
                 onPress={() => router.push(`/(account)/cashDepositDetails`)}
                className="flex-row justify-between bg-black-200 rounded-xl p-4 items-center"
                >
                     <View className="flex flex-col items-start">
                    <Text className="text-lg font-medium text-primary">{item.name}</Text>
                    <Text className="text-sm text-gray-200">{item.date}</Text>
                   </View>
                    
                    <Text className="text-lg text-primary">{item.amount}</Text>
                    
                </TouchableOpacity>
          </View>
        ))}
       </>
    );
};

export default CashOutList;
