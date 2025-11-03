import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useWarehouseQuery, useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useNavigation, router } from "expo-router";
import { useTransactionListQuery } from "@/store/api/transactionApi";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";
import PrintButton from "../PrintButton";

export default function CashInReport() {
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  const { data: warehousesData } = useWarehousesQuery();

  const [warehouses, setWarehouses] = useState<WarehouseTypes[]>([]);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());

  const formatDateString = (date: Date) => date.toISOString().split("T")[0];

  const selectedDateString = formatDateString(fromDate);

  const { data } = useWarehouseQuery(userInfo?.warehouse);

  const {
    data: cashDeposit,
    isSuccess,
    isLoading,
    error,
    isError,
    refetch,
  } = useTransactionListQuery({
    warehouse: userInfo?.warehouse,
    type: "deposit",
    date: format(currentDay, "MM-dd-yyyy"),
    forceRefetch: true,
  });

  useEffect(() => {
    refetch();
  }, [cashDeposit]);

  // warehouse role
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    userInfo.role === "userInfo" ? userInfo.warehouse : null
  );

  // Set warehouses after fetch
  useEffect(() => {
    if (userInfo?.role === "userInfo") {
      setWarehouses(warehousesData);
    } else if (userInfo?.role === "admin") {
      setSelectedWarehouse(warehousesData?.[0]?._id);
    }
  }, [warehousesData, userInfo]);

  // Header with print button
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cash Deposit Report",
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
        <PrintButton
          filteredData={cashDeposit?.transactions || []}
          title="Cash Deposit Report"
        />),
    });
  }, [navigation, cashDeposit]);

  // Filter data by role, warehouse, and date
  const totalCashIn = cashDeposit?.transactions?.length || 0;
  const totalAmount =
    cashDeposit?.transactions?.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    ) || 0;

  return (
    <>
      <StatusBar style="light" backgroundColor="white" />
      <View className="flex-1 bg-dark p-2">
        {/* Filters */}
        <View className="flex-row justify-between items-center mb-4">
          {userInfo?.type === "admin" && warehouses?.length > 0 && (
            <Dropdown
              data={warehouses.map((wh) => ({
                label: wh.name,
                value: wh._id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select Warehouse"
              value={selectedWarehouse}
              onChange={(item: any) => setSelectedWarehouse(item.value)}
              placeholderStyle={{ color: "white" }}
              style={{
                backgroundColor: "#1f1f1f",
                borderRadius: 8,
                padding: 8,
                width: 180,
                height: 45,
              }}
              selectedTextStyle={{ color: "white" }}
              itemTextStyle={{ color: "black" }}
            />
          )}

          {/* From / To Dates */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="p-2 rounded-xl bg-black-200 flex-col items-center"
            >
              <Ionicons name="calendar-number-sharp" size={24} color="#fdb714" />
              <Text className="text-white text-sm">
                {format(fromDate, "dd MMM yyyy")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="p-2 rounded-xl bg-black-200 flex-col items-center"
            >
              <Ionicons name="calendar-number-sharp" size={24} color="#fdb714" />
              <Text className="text-white text-sm">
                {format(toDate, "dd MMM yyyy")}
              </Text>
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
            <Text className="text-zinc-300 text-sm">Total Cash In</Text>
            <Text className="text-yellow-400 text-xl font-bold">
              {totalCashIn}
            </Text>
          </View>
          <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
            <Text className="text-zinc-300 text-sm">Total Amount</Text>
            <Text className="text-primary text-xl font-bold">
              {totalAmount} BDT
            </Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={cashDeposit?.transactions || []}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <View className="bg-black-200 p-4 rounded-xl mb-3">
              <Text className="text-gray-300 text-xl">
                Name: {String(item?.name ?? "")}
              </Text>
              <View className="flex-row justify-between mt-2 items-center">
                <Text className="text-gray-300">
                  {item?.date ? format(new Date(item.date), "dd-MM-yyyy") : ""}
                </Text>
                <Text className="text-white font-semibold text-lg">
                  <Text className="text-primary">{item?.amount ?? 0}</Text>
                  {" BDT"}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
}
