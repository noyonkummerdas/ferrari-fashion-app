import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { format } from 'date-fns';
import { useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes






const data =[
    {
        name:'niloy howlader',
        age:22
    }
]

const customers = [


  {
    id: "c1",
    name: "Rahim Store",
    totalSales: 150000,
    invoices: 12,
    paid: 120000,
    due: 30000,
    lastPurchase: "2025-09-01",
  },
  {
    id: "c2",
    name: "Karim Enterprise",
    totalSales: 85000,
    invoices: 6,
    paid: 85000,
    due: 0,
    lastPurchase: "2025-08-28",
  },
  {
    id: "c3",
    name: "Karim Enterprise",
    totalSales: 85000,
    invoices: 6,
    paid: 85000,
    due: 0,
    lastPurchase: "2025-08-28",
  },
  {
    id: "c4",
    name: "Karim Enterprise",
    totalSales: 85000,
    invoices: 6,
    paid: 85000,
    due: 0,
    lastPurchase: "2025-08-28",
  },
  {
    id: "c5",
    name: "Karim Enterprise",
    totalSales: 85000,
    invoices: 6,
    paid: 85000,
    due: 0,
    lastPurchase: "2025-08-28",
  },
];
const customerReport = () => {
  const [customerReport, setCustomerReport] = useState<any>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
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
      title: `${data?.name || "Customer Report"}`,
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
        headerRight: () => (
               <View className="me-4 flex flex-row justify-center items-center gap-2">
                 {/* <TouchableOpacity
                   onPress={() => console.log("download")}
                   className="flex flex-row justify-center items-center gap-2"
                 >
                   <Ionicons name="download-outline" size={24} color="#ffffff" />
                 </TouchableOpacity> */}
                 <TouchableOpacity
                   onPress={() => console.log("print")}
                   className="flex flex-row justify-center items-center gap-2"
                 >
                   <Ionicons name="print-outline" size={30} color="gray" />
                 </TouchableOpacity>
               </View>
             ),
        });
      }, [navigation, data]);
  return (
    <View className="flex-1 bg-dark">
      {/* Header */}
       <View className='flex-row items-center justify-between -2 mb-4'>
          <View>

            {/* <Text className="text-white ms-2 ">Select Warehouse</Text> */}
          <Dropdown
              data={warehouses.map((wh) => ({ label: wh.name, value: wh._id }))}
              labelField="label"
              valueField="value"
              placeholder="Select Warehouse"
              value={selectedWarehouse}
              onChange={(item: any) => setSelectedWarehouse(item.value)}
              placeholderStyle={{ color: 'white' }}
              style={{ backgroundColor: '#1f1f1f', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, width: 190, height: 45,marginTop: 10 }}
              selectedTextStyle={{ color: 'white' }}
              itemTextStyle={{ color: 'black' }}
            />
          </View>

        <View className="flex-row gap-3 mt-3">
        <TouchableOpacity onPress={() => setShowStartPicker(true)} className="p-2 ms-2 rounded-xl bg-black-200 flex-col">
          <Text className='text-white'><Ionicons name="calendar-number-sharp" size={24} color="#fdb714" /></Text>
          <Text className="text-white  text-sm"> {format(fromDate, "dd MMM yyyy")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} className="p-2 rounded-xl bg-black-200  flex-col">
          <Text className='flex-row justify-end items-end text-end' ><Ionicons className="flex-row justify-end items-center " name="calendar-number-sharp" size={24} color="#fdb714" /></Text>
          <Text className="text-white  text-sm"> {format(toDate, "dd MMM yyyy")}</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
          <Text className="text-zinc-300 text-sm">Total Customers</Text>
          <Text className="text-yellow-400 text-xl font-bold">25</Text>
        </View>
        <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
          <Text className="text-zinc-300 text-sm">Total Sales</Text>
          <Text className="text-primary text-xl font-bold">3,25,000 BDT</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-black-200 p-4 rounded-2xl mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-200 text-lg font-semibold">
                {item.name}
              </Text>
              
            </View>
            
            <View className="flex-row justify-between">
           <View>
             <Text className="text-zinc-400 text-sm mt-1">
              Last Sale: {item.lastPurchase}
            </Text>

              <Text className="text-gray-300 font-bold">
                Sales: {item.totalSales.toLocaleString()} BDT
              </Text>
           </View>
              <View>
                <Text className="text-green-400 font-bold">
                Paid: {item.paid.toLocaleString()} BDT
              </Text>
              <Text className="text-primary font-bold">
                Due: {item.due.toLocaleString()} BDT
              </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default customerReport;