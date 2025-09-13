import { StyleSheet, Text, useColorScheme, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { router } from 'expo-router';
import { useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes


const data =[
    {
        name :'hasibur'
    }
]
const productReport = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();



    
      const currentUser = {
      role: "admin", // "admin" or "user"
      warehouse: "w1",
    };
      
      const { data: userInfo } = { data: currentUser };
        const { data: warehousesData } = useWarehousesQuery();
        const [warehouses, setWarehouses] = useState<WarehouseTypes[]>([]);
    
        // warehouse  role
          const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
            currentUser.role === "user" ? currentUser.warehouse : null
          );
          // Set warehouses after fetch
          useEffect(() => {
            if (warehousesData) {
              setWarehouses(warehousesData);
              if (currentUser.role === "admin" && warehousesData.length > 0) {
                setSelectedWarehouse(warehousesData[0]._id);
              }
            }
          }, [warehousesData]);
    useLayoutEffect(() => {
        navigation.setOptions({
          title:'Product Report',
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
    <View>
      <Text className='text-gray-200'>productReport</Text>
    </View>
  )
}

export default productReport

const styles = StyleSheet.create({})