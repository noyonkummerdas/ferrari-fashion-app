import { CustomDrawerToggleButton } from '@/components';
import { Colors } from '@/constants/Colors';
import { useAddWarehouseMutation } from '@/store/api/warehouseApi'; // ✅ change to your actual import
import { Ionicons } from '@expo/vector-icons';
import { Link, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Text, TextInput, useColorScheme, View } from 'react-native';

const Warehouse = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  // ✅ RTK Query mutation hook
  const [addWarehouse] = useAddWarehouseMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Warehouse",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
       headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
       headerRight: () => <View className="flex flex-row items-center">
        <Link href="warehouse/warehouseEdit" className="text-white">
         <View className="flex flex-row items-center">
          <Ionicons name="add" size={24} color="gray" />
          <Text className='text-gray-200 font-lg'>Add</Text>
         </View>
        </Link>
       </View>,
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
    <View className="flex flex-row justify-between items-center w-[390px] h-12 bg-black-200 rounded-lg m-2 p-2 mx-auto">
      <TextInput
        placeholder="Search Warehouse"
        className="p-2 placeholder:text-gray-400 text-gray-300"
      />
      <Ionicons name="search" size={20} color="#fdb714" />
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

    
  </View>
);

};

export default Warehouse;
