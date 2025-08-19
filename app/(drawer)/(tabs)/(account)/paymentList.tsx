import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

const PaymentList = () => {



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
          title: "payment List",
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



     const paymentList=[
        {
            invoice: 1123,
            name: "John Doe",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1124,
            name: "Jane Smith",
            amount: 2000,
            date: "2023-10-02",
        },
        {
            invoice: 1125,
            name: "Alice Johnson",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1126,
            name: "Bob Brown",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1125,
            name: "Charlie Davis",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1126,
            name: "David Wilson",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1127,
            name: "Emma Thompson",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1128,
            name: "Frank Harris",
            amount: 1000,
            date: "2023-10-01",
        },
        {
            invoice: 1129,
            name: "George Martin",
            amount: 1000,
            date: "2023-10-01",
        },
      ]
   const [search, setSearch] = useState("");
          const filteredList = paymentList.filter(
            (item) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.amount.toString().includes(search) ||
              item.date.includes(search)
          );

     const today = new Date();
  const formattedDate = {
    day: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }), // e.g. August
    year: today.getFullYear(),
  };
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

        <View className="flex flex-row justify-between items-center bg-black-200  p-3 rounded-lg">
                        <TouchableOpacity>
                          <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View className=" flex flex-row item-center bg-black-200">
                          <Text className="text-white text-lg me-2">
                            {formattedDate.day}
                            <Text className="text-primary text-lg">
                              {formattedDate.month}
                            </Text>{" "}
                            <Text className="text-white text-lg ">{formattedDate.year}</Text>
                          </Text>
                        </View>
              
                        <TouchableOpacity>
                          <Ionicons name="arrow-forward" size={24} color="white" />
                        </TouchableOpacity>
                      </View>
        {paymentList?.map((item) => (
          <View key={item.id} 
          className="mt-4">
                <TouchableOpacity
                 onPress={() => router.push(`/(account)/cashDepositDetails`)}
                className="flex-col justify-between bg-black-200 rounded-xl p-4"
                >
        
                        <View className="flex flex-row items-center justify-between">
                              <Text className="text-lg font-medium text-primary">{item.name}</Text>
                            <Text className="text-sm text-gray-200">{item.date}</Text>
                        </View>
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-md text-gray-200">Invoice: {item.invoice}</Text>
                            <Text className="text-lg text-primary">{item.amount} <Text className="text-white">BDT</Text></Text>
                        </View>
                </TouchableOpacity>
          </View>
        ))}
       </>
    );
};

export default PaymentList;
