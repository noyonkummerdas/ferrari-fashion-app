import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, formatDate, isAfter, isBefore } from "date-fns";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { useCashInTransactionQuery, useTransactionListQuery } from "@/store/api/transactionApi";
import { StatusBar } from "expo-status-bar";
import PrintButton from "../PrintButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useGetCustomerByIdQuery } from "@/store/api/customerApi";

export default function CashInReport() {
  const navigation = useNavigation();
  const {userInfo : currentUser} = useGlobalContext();
  const { data: warehousesData } = useWarehousesQuery();
  const [warehouses, setWarehouses] = useState<WarehouseTypes[]>([]);
  // const type = userInfo?.type
  // console.log(type)

  
//   const [cashInData, setCashInData] = useState<any[]>([]); // backend data
  const [fromDate, setFromDate] = useState<Date>(new Date());
    const { id } = useLocalSearchParams();
    // console.log(id)
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

const formatDateString = (date: Date) => date.toISOString().split("T")[0];

// replace this
// const selectedDateString = formatDate(selectedDate);
const selectedDateString = formatDateString(fromDate);

 const { data : customerDue , refetch, isSuccess, isError } = useGetCustomerByIdQuery({
    id,
    date: currentDate.toDateString(),
    isDate:'month',
    forceRefetch: true,
  });
  // console.log("customer data", customerDue, isSuccess, isError);

 useEffect(()=>{
    refetch()
 },[customerDue, isSuccess])
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

  // Fetch CashIn data from backend (replace with your API)


  // Header with print button
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Customer Due Report",
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
      //   // <TouchableOpacity
      //   //   onPress={() => Alert.alert("Print", "Printing Cash In Report...")}
      //   //   className="me-4"
      //   // >
      //   //   <Ionicons name="print-outline" size={28} color="white" />
      //   // </TouchableOpacity>
      //   <PrintButton filteredData={customers} title="Customer Due Report" />
      // ),
    });
  }, [navigation]);
 

  return (
    <>
    <StatusBar style="light" backgroundColor="white" />
    <View className="flex-1 bg-dark p-2">
      {/* Filters */}
      <View className="flex-row justify-between items-center mb-4">
       
          <Dropdown
            data={warehouses.map((wh) => ({ label: wh.name, value: wh._id }))}
            labelField="label"
            valueField="value"
            placeholder="Select Warehouse"
            value={selectedWarehouse}
            onChange={(item: any) => setSelectedWarehouse(item.value)}
            placeholderStyle={{ color: "white" }}
            style={{ backgroundColor: "#1f1f1f", borderRadius: 8, padding: 8, width: 180, height: 45 }}
            selectedTextStyle={{ color: "white" }}
            itemTextStyle={{ color: "black" }}
          />

        {/* From / To Dates */}
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => setShowStartPicker(true)} className="p-2 rounded-xl bg-black-200 flex-col items-center">
            <Ionicons name="calendar-number-sharp" size={24} color="#fdb714" />
            <Text className="text-white text-sm">{format(fromDate, "dd MMM yyyy")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowEndPicker(true)} className="p-2 rounded-xl bg-black-200 flex-col items-center">
            <Ionicons name="calendar-number-sharp" size={24} color="#fdb714" />
            <Text className="text-white text-sm">{format(toDate, "dd MMM yyyy")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(e, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setFromDate(selectedDate);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(e, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setToDate(selectedDate);
          }}
        />
      )}

      {/* Summary */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
          <Text className="text-zinc-300 text-sm">Total Customer Due</Text>
          {/* <Text className="text-yellow-400 text-xl font-bold">{filteredData.length}</Text> */}
        </View>
        <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
          <Text className="text-zinc-300 text-sm">Total Amount</Text>
          <Text className="text-primary text-xl font-bold">
            {/* {filteredData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} BDT */}
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={customerDue}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-black-200 p-4 rounded-xl mb-3">
            <Text className="text-white font-semibold">{item.source}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-400">{item.date}</Text>
              <Text className="text-green-400 font-bold">+ {item.amount.toLocaleString()} BDT</Text>
            </View>
          </View>
        )}
      />

       <FlatList
              data={customerDue}
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
    </>
  );
}
