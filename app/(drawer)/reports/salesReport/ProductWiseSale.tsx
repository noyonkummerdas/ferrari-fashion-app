import { ScrollView, Text, TouchableOpacity, View, Alert, useColorScheme, Platform } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Dropdown } from 'react-native-element-dropdown';
import { useAllSaleQuery } from "@/store/api/saleApi";
import { useGlobalContext } from "@/context/GlobalProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, startOfDay, endOfDay } from "date-fns";
import { useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes
    import { StatusBar } from "expo-status-bar";


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
  const saleProductDetails =[
   {
    qty:200,
    name:'Zines',
    code:'11092',
    amount:'2000',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
   {
    qty:200,
    name:'Zines',
    amount:'2000',
    code:'11092',
    fromDate:'09-25-2025',

   },
  ]
const ProductWiseSale = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [filteredSales, setFilteredSales] = useState<Transaction[]>([]);



  const currentUser = {
  role: "admin", // "admin" or "user"
  warehouse: "w1",
};
  
  const { data: userInfo } = { data: currentUser };
    const type = userInfo?.type;
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

  const exportCSV = async () => {
    try {
      let csv = "Invoice,Customer,Warehouse,Amount\n";
      filteredSales.forEach((sale) => {
        csv += `${sale.invoice || sale.invoiceId},${sale.customerName || sale.customerId?.name || ''},${sale.warehouse || ''},${sale.amount || 0}\n`;
      });
      const fileUri = FileSystem.documentDirectory + "sales_report.csv";
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert("Error", "Failed to export CSV");
    }
  };

  const exportPDF = async () => {
    try {
      const html = `
        <h1>Sales Report</h1>
        <table border="1" cellspacing="0" cellpadding="5">
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Warehouse</th>
            <th>Amount</th>
          </tr>
          ${filteredSales.map((sale) => `
            <tr>
              <td>${sale.invoice || sale.invoiceId}</td>
              <td>${sale.customerName || sale.customerId?.name || ''}</td>
              <td>${sale.warehouse || ''}</td>
              <td>৳${sale.amount?.toLocaleString() || 0}</td>
            </tr>
          `).join('')}
        </table>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to export PDF");
    }
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
      navigation.setOptions({
        title: "Product Wise Sale Report",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="ms-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => Alert.alert("Print", "Printing Cash In Report...")}
            className="me-4"
          >
            <Ionicons name="print-outline" size={28} color="white" />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);



  // const customerWiseSales =[
  //   {
  //     name: "Haidar Ali",
  //     balance: 2899900
  //   },
  //   {
  //     name: "Morshed Alam",
  //     balance: 128000
  //   },
  //   {
  //     name: "Jony Mia",
  //     balance: 23000
  //   },
  //   {
  //     name: "Jewel Rana",
  //     balance: 100000
  //   },
  // ]
  // const saleProductDetails =[
  //   {
  //     name: "Hudie ",
  //     balance: 150000
  //   },
  //   {
  //     name: "T- Shirt",
  //     balance: 128000
  //   },
  //   {
  //     name: "Jeans Pant",
  //     balance: 23000
  //   },
  //   {
  //     name: "Frog",
  //     balance: 100000
  //   },
  // ]

  return (
    <>
     <StatusBar style="light" backgroundColor="white" />
    <View className='bg-dark flex-1 p-2'>
    
     {userInfo?.role === "admin" && (
        <>
        <View className='flex-row items-center justify-evenly'>
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
              style={{ backgroundColor: '#1f1f1f', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, width: 180, height: 60,marginTop: 10 }}
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
        </>
      )}
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

      {/* <TouchableOpacity onPress={exportCSV} className="bg-primary p-3 rounded-xl mt-3 items-center">
        <Text className="text-black font-bold">Export CSV</Text>
      </TouchableOpacity> */}

      {/* <View className="mt-4">
        <Text className="text-white text-lg font-bold mb-2">Sales Report</Text>
        {filteredSales.length === 0 && (
          <Text className="text-gray-400 text-center mt-4">No sales data available</Text>
        )}
        {filteredSales.map((sale, idx) => (
          <View key={idx} className="flex-row justify-between py-2 border-b border-gray-700">
            <Text className="text-gray-300">{sale.invoice || sale.invoiceId}</Text>
            <Text className="text-white">৳{sale.amount?.toLocaleString()}</Text>
          </View>
        ))}
      </View> */}
      {/**total sale*/}
      <View className="mt-4 p-4 bg-black-200 rounded-xl ">
        <Text className='text-gray-300 font-bold text-lg'>Product Sale </Text>
        <Text className='text-gray-300'>Amount :<Text className='text-primary'> 12000000</Text></Text>
        </View>

        <ScrollView>
        {/**product wise sale */}
        <View className="mt-4 rounded-xl">
        {/* <Text className='text-gray-300 font-bold text-lg'>Product based sale</Text> */}
        {
          saleProductDetails.map((product, idx) => (
            
            <View key={idx} className="bg-black-200 justify-between py-2 p-2 mb-2 rounded-lg ">
              <Text className="text-white text-xl">Product : {product.name}</Text>
             <View className='flex-row justify-between'>
               <View className='flex-col '>
              <Text className='text-gray-200'>Code : {product.code}</Text>
              <Text className='text-gray-300'>Date : {product.fromDate}</Text>
              </View>

              <View className='flex-col items-center justify-end'>
              <Text className='text-gray-200'>  <Text className='text-primary'>{product.qty}</Text> : Qty </Text>
              <Text className="text-gray-200"><Text className='text-primary ms-2'>{product.amount}</Text>  BDT</Text>
              </View>
             </View>
            </View>
          ))}
        </View>
        {/**customer wise sale */}
        {/* <View className="mt-4 p-4 bg-black-200 rounded-xl ">
          <Text className='text-gray-300 font-bold text-lg'>Customer Wise Sale report </Text>
          {
            customerWiseSales.map((customer, idx) => (
              <View key={idx} className="flex-row justify-between py-2 border-b border-gray-700">
                <Text className="text-gray-300">{customer.name}</Text>
                <Text className="text-white">৳{customer.balance?.toLocaleString()}</Text>
              </View>
            ))}
        </View> */}

      {/* <TouchableOpacity onPress={() => router.back()} className="bg-primary p-4 rounded-xl items-center mt-4">
        <Text className="text-black font-semibold">Back</Text>
      </TouchableOpacity> */}
    </ScrollView>
    </View>
    </>
  );
};

export default ProductWiseSale;
