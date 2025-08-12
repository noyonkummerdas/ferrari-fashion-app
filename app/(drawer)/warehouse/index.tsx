import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
// import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";


const CustomDrawerToggleButton = ({ tintColor = "#FDB714" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="menu" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};


const Warehouse = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      // <View className='me-4' >
      //     <TouchableOpacity onPress={()=>setIsPhoto(!isPhoto)} className='flex flex-row justify-center items-center gap-2'>
      //       <Ionicons name={isPhoto ? "image-sharp" : "image-outline"} size={24}  color="#f2652d" />
      //       <Text className='text-primary text-xl font-pmedium'>Photo</Text>
      //     </TouchableOpacity>
      // </View>
      // ),
      title: "Warehouse",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
       headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: true,
      headerTitleAlign: "left",
      headerShown: true,
    });
  }, [navigation]);


  const warehouse = [
    {
      id: 1,
      name: "Factory",
      address:"House 06, Road 27, Sector 27, Uttara, Dhaka 1230",
      capacity: 1000,
      // Add more properties as needed
      manager: "Manager 1",
      contact: "123-456-7890",
      status: "Active",
    },
    {
      id: 2,
      name: "Embro",
      address: "House 06, Road 27, Sector 27, Uttara, Dhaka 1230",
      capacity: 2000,
       status: "Active",
       contact: "123-456-7890",
    },
    {
      id: 3,
      name: "Ferrari City",
      address: "House 06, Road 27, Sector 27, Uttara, Dhaka 1230",
      capacity: 3000,
       status: "Active",
       contact: "123-456-7890",
    },
    {
      id: 3,
      name: "Ferrari Sahabag",
      address: "House 06, Road 27, Sector 27, Uttara, Dhaka 1230",
      capacity: 3000,
       status: "Active",
       contact: "123-456-7890",
    },
  ];

  return (
  <View className="flex-1 bg-dark">
    {/* Search bar */}
    <View className="flex flex-row justify-between items-center w-[390px] bg-black-200 p-2 rounded-full m-2 mx-auto">
      <TextInput
        placeholder="Search Warehouse"
        className="p-4 placeholder:text-gray-400"
      />
      <Ionicons name="search" size={24} color="gray" />
    </View>

    {/* Warehouse list */}
    {warehouse.map((wh) => (
      <View
        key={wh.id}
        className="p-4 m-2 rounded-lg bg-black-200 w-[380px] h-[84px] mx-auto border-zinc-800 items-center flex flex-row justify-between"
      >
        <View>
          <Text className="text-xl font-bold text-white">{wh.name}</Text>
          <Text className="text-sm text-gray-200 w-[280px]">
            {wh.address}
          </Text>
          <Text className="text-sm text-gray-200">
            Contact: {wh.contact}
          </Text>
        </View>
        <Text className="text-lg font-bold text-primary">{wh.status}</Text>
      </View>
    ))}

    {/* Floating Add Button */}
    <TouchableOpacity
      className="absolute bottom-6 right-4 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
      onPress={() => router.push("/warehouse/warehouseEdit")}
    >
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

};

export default Warehouse;
