import { ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { useAllSaleQuery } from "@/store/api/saleApi";
import { useGlobalContext } from "@/context/GlobalProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isAfter, isBefore } from "date-fns";
import { useWarehousesQuery } from "@/store/api/warehouseApi";
import { WarehouseTypes } from "@/types/warehouse";
import { StatusBar } from "expo-status-bar";
import PrintButton from "../PrintButton";

interface Transaction {
  _id: string;
  date?: string;
  amount?: number;
  invoice?: string;
  invoiceId?: string;
  customerName?: string;
  customerId?: { name?: string };
  warehouse?: string;
  items?: any[];
}

const saleProductDetails = [
  {
    name: "Hudie ",
    balance: 150000
  },
  {
    name: "T- Shirt",
    balance: 128000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    balance: 100000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    balance: 100000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    balance: 100000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    balance: 100000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    balance: 100000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    balance: 100000
  },
  {
    name: "Jeans Pant",
    balance: 23000
  },
  {
    name: "Frog",
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Hudie ",
      balance: 150000
    },
    {
      name: "T- Shirt",
      balance: 128000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
    {
      name: "Jeans Pant",
      balance: 23000
    },
    {
      name: "Frog",
      balance: 100000
    },
  ]
const SalesReport = () => {
  const { userInfo } = useGlobalContext();
   const navigation = useNavigation();
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  // const colorScheme = useColorScheme(); 
     const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(userInfo?.warehouse ?? null);
      const { data: warehousesData } = useWarehousesQuery();
      const [warehouses, setWarehouses] = useState<WarehouseTypes[]>([]);

 const { data: salesData, isSuccess, refetch } = useAllSaleQuery({
    warehouse: userInfo?.warehouse as string,
    startDate: format(currentDay, "MM-dd-yyyy"),
    isDate: "month",
     forceRefetch: true,
  });
  // console.log("SalesData:", salesData);

  useEffect(() => {
     refetch()
  }, [salesData, isSuccess]);  
  // warehouse  role
    // Set warehouses after fetch
    useEffect(() => {
        if (warehousesData) {
          setWarehouses(warehousesData);
          if ( warehousesData.length > 0) {
            setSelectedWarehouse(warehousesData);
          }
        }
      }, [warehousesData, userInfo]);
 
  useLayoutEffect(() => {
      navigation.setOptions({
        title: "Sales Report",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="ms-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ),
        // headerRight: () => (
          // <TouchableOpacity
          //   onPress={() => Alert.alert("Print", "Printing Cash In Report...")}
          //   className="me-4"
          // >
          //   <Ionicons name="print-outline" size={28} color="white" />
          // </TouchableOpacity>
          // <PrintButton filteredData={saleProductDetails} title="Sales Report" />
        // ),
      });
    }, [navigation]); 
     const formattedDate = {
    month: currentDay.toLocaleString("en-US", { month: "long" }),
    year: currentDay.getFullYear(),
  };
const totalSale = Array.isArray(salesData)
  ? salesData.reduce((sum, item) => sum + (item?.amount || 0), 0)
  : 0;


  // console.log("userInfo", userInfo.type,warehouses.length);
  return (
    <>
     <StatusBar style="light" backgroundColor="white" />
          <View className='bg-dark flex-row p-2'>
            {
              userInfo?.type === "admin" && warehouses?.length > 0 && 
            <View className="flex-row justify-between items-center">
                <Dropdown
                  data={warehouses.map((wh) => ({ label: wh.name, value: wh._id }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Warehouse"
                  value={selectedWarehouse}
                  onChange={(item: any) => setSelectedWarehouse(item.value)}
                  placeholderStyle={{ color: 'white' }}
                  style={{ backgroundColor: '#1f1f1f', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, width: 180, height: 60,marginTop: 10 }}
                  selectedTextStyle={{ color: 'white' }}
                  itemTextStyle={{ color: 'black' }}
                  />
            </View>
              }

            <View className="flex-row gap-3 mt-3">
              <TouchableOpacity onPress={() => setShowStartPicker(true)} className="p-2 ms-2 rounded-xl bg-black-200 flex-col">
                <Text className='text-white'><Ionicons name="calendar-number-sharp" size={24} color="#fdb714" /></Text>
                <Text className="text-white text-sm">{format(fromDate, "dd MMM yyyy")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEndPicker(true)} className="p-2 rounded-xl bg-black-200 flex-col">
                <Text className='text-white'><Ionicons name="calendar-number-sharp" size={24} color="#fdb714" /></Text>
                <Text className="text-white text-sm">{format(toDate, "dd MMM yyyy")}</Text>
              </TouchableOpacity>
            </View>
          </View>

        {/* Date Pickers */}

        

        {showStartPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => { date && setFromDate(date); setShowStartPicker(false); }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => { date && setToDate(date); setShowEndPicker(false); }}
          />
        )}

      
        {/**total sale*/}
             <View className="mt-4 p-4 bg-black-200 rounded-xl flex flex-row item-center justify-between ">
        <Text className='text-gray-200 text-xl'>Total Sale </Text>
        <Text className='text-gray-300 text-lg text-primary'> {totalSale}</Text>
        </View>

        <ScrollView>
            {/**product wise sale */}
            <View className="mt-4 p-4 bg-black-200 rounded-xl ">
            {/* <Text className='text-gray-300 font-bold text-lg'>Product based sale</Text> */}
            {
              salesData?.map((product, idx) => (
                <View key={idx} className="flex-row justify-between py-2 border-b border-gray-700">
                  <Text className="text-gray-200">{product?.customerName}</Text>
                  <Text className="text-gray-200"><Text className='text-primary'>{product.amount?.toLocaleString()}</Text> BDT</Text>
                </View>
              ))}
            </View>
            {/**customer wise sale */}
          
        </ScrollView>
    </>
  );
};

export default SalesReport;
