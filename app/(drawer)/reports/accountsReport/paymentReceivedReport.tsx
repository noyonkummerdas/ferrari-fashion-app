import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, formatDate, isAfter, isBefore } from "date-fns";
import { useNavigation, router } from "expo-router";
import { useCashInTransactionQuery, useTransactionListQuery } from "@/store/api/transactionApi";
  import { StatusBar } from "expo-status-bar";
  import PrintButton from "../PrintButton";
import { useGlobalContext } from "@/context/GlobalProvider";


// Logged-in user example
// const currentUser = {
//   role: "admin", // "admin" or "user"
//   warehouse: "w1",
// };
// const received = [
//   { id: "r1", date: "2025-09-01", customer: "Rahim Store", amount: 20000 },
//   { id: "r2", date: "2025-09-02", customer: "Karim Enterprise", amount: 10000 },
//   { id: "r3", date: "2025-09-01", customer: "Rahim Store", amount: 20000 },
//   { id: "r4", date: "2025-09-02", customer: "Karim Enterprise", amount: 10000 },
//   { id: "r5", date: "2025-09-01", customer: "Rahim Store", amount: 20000 },
//   { id: "r6", date: "2025-09-02", customer: "Karim Enterprise", amount: 10000 },
//   { id: "r7", date: "2025-09-01", customer: "Rahim Store", amount: 20000 },
//   { id: "r8", date: "2025-09-02", customer: "Karim Enterprise", amount: 10000 },
//   { id: "r9", date: "2025-09-01", customer: "Rahim Store", amount: 20000 },
//   { id: "r10", date: "2025-09-02", customer: "Karim Enterprise", amount: 10000 },
// ];

export default function PaymentReceivedReport() {
  const navigation = useNavigation();
  // const { data: userInfo } = { data: currentUser };
 const {userInfo: currentUser} = useGlobalContext()
 
  // const type = userInfo?.type
  const { data: warehousesData } = useWarehousesQuery();
  const [warehouses, setWarehouses] = useState<WarehouseTypes[]>([]);

  
//   const [cashInData, setCashInData] = useState<any[]>([]); // backend data
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); 

const formatDateString = (date: Date) => date.toISOString().split("T")[0];

// replace this
// const selectedDateString = formatDate(selectedDate);
const selectedDateString = formatDateString(fromDate);

// const {data: cashInData, isLoading, refetch} = useTransactionListQuery({ warehouse: "w1", type: "payment", date: selectedDateString })
// console.log("CashInData:", cashInData);
  const { data  : paymentReceivedData, isSuccess, isLoading, error, isError, refetch } =
    useTransactionListQuery({
      warehouse: currentUser?.warehouse,
      type: "paymentReceived",
      date: format(currentDate, "MM-dd-yyyy"),
      forceRefetch: true,
    });
    console.log("PaymentReceivedData:", paymentReceivedData, isSuccess, isError);


 useEffect(()=>{
    refetch()
 },[paymentReceivedData, currentDate])
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

  // Header with print button
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Payment Received Report",
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
      //   <TouchableOpacity
      //     onPress={() => Alert.alert("Print", "Printing Cash In Report...")}
      //     className="me-4"
      //   >
      //     <Ionicons name="print-outline" size={28} color="white" />
      //   </TouchableOpacity>
      //   <PrintButton filteredData={received} title="Payment Received Report" /> 
      // ),
    });
  }, [navigation])

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
          <Text className="text-zinc-300 text-sm">Total payment Received</Text>
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
          data={paymentReceivedData?.data || []}
          keyExtractor={(item) => item._id?.toString()}
          renderItem={({ item }) => (
            <View className="bg-black-200 p-4 rounded-xl mb-3">
              <Text className="text-white font-semibold">{item?.customerId?.name}</Text>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-400">{item?.date}</Text>
                <Text className="text-green-400 font-bold">+ {item?.amount} BDT</Text>
              </View>
            </View>
          )}
        />

      {/* {paymentReceivedData?.length > 0 ? (
              paymentReceivedData?.map((item) => (
                <View key={item._id} className="mt-4 mx-4">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/paymentReceivedDetails",
                        params: { _id: item?._id },
                      })
                    }
                    className="flex-row justify-between bg-black-200 rounded-xl p-4 items-center"
                  >
                    <View className="flex flex-col items-start">
                      <Text className="text-lg font-medium text-primary">
                        {item.customerId?.name}
                      </Text>
                      <Text className="text-sm text-gray-200">
                        {item?.date && format(new Date(item?.date), "dd-MM-yyyy")}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-sm text-primary capitalize">
                        {item.type}
                      </Text>
                      <Text className="text-lg text-primary">
                        ৳{item.amount?.toLocaleString()}{" "}
                        <Text className="text-white">BDT</Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="flex-1 h-96 w-full justify-center items-center mt-10">
                <Ionicons name="save-outline" size={60} color="gray" />
                <Text className="text-primary text-lg mt-4">No data found</Text>
                <Text className="text-white text-sm">
                  Please select a different date
                </Text>
              </View>
            )} */}

       <FlatList
              data={paymentReceivedData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-black-200 p-4 rounded-xl mb-3">
                  <Text className="text-white font-semibold">{item?.customerId?.name}</Text>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-gray-400">{item?.date}</Text>
                    <Text className="text-gray-200"><Text className="text-primary">{item.amount}</Text> BDT</Text>
                  </View>
                </View>
              )}
            />
    </View>
    </>
  );
}
