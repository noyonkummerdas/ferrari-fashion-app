import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const data =[
    {
        name:'any'
    }
]
const reports = [
    { id: "1", title: "Cash In", route: "/(drawer)/reports/cashInReport", desc: "Track all incoming cash" },
    { id: "2", title: "Cash Out", route: "/(drawer)/reports/cashoutReport", desc: "Track all outgoing cash" },
    { id: "3", title: "Payment", route: "/(drawer)/reports/paymentReport", desc: "Payments made to suppliers/vendors" },
    { id: "4", title: "Payment Received", route: "/(drawer)/reports/paymentReceivedReport", desc: "Payments received from customers" },
  ];

const accountsReport = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
          title:"Accounts Report",
          //@ts-ignore
          headerStyle: {
            backgroundColor: `#000000`, //`${Colors[colorScheme ?? "dark"].backgroundColor}`,
          },
          //@ts-ignore
          headerTintColor: `#ffffff`,
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        //   headerRight: () => (
        //     <TouchableOpacity
        //       onPress={() => router.push(`/customer/${id}`)}
        //       className="flex flex-row items-center gap-2"
        //     >
        //       <Ionicons name="pencil-outline" size={24} color="white" />
        //       <Text className="text-white text-lg">Edit</Text>
        //     </TouchableOpacity>
        //   ),
        });
      }, [navigation, data]);   
  return (
    <ScrollView className="flex-1 bg-dark p-2">
      <Text className="text-white text-2xl font-bold mb-6">
        Accounts Report
      </Text>

      {reports.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="bg-black-200 rounded-2xl p-5 mb-4 shadow-lg"
          onPress={() => router.push(item?.route)}
        >
          <Text className="text-white text-lg font-semibold mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-400 text-sm">{item.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>


      
  )
}

export default accountsReport

const styles = StyleSheet.create({})