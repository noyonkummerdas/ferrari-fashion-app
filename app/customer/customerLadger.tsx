import { useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CustomerLedger = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Ensure id is a string
  const customerId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading, isFetching, refetch } = useGetCustomerByIdQuery(
    {
      id: customerId,
      date: new Date().toDateString(), // Current date
      isDate: 'all', // Get all transactions (not filtered by date)
    },
    { skip: !customerId }
  );

  console.log("Customer ID:", customerId);
  console.log("Customer Data:", data);
  console.log("Is Loading:", isLoading);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.customer?.name || "Customer Ledger",
      headerStyle: { backgroundColor: "#000" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="ms-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  // Show all transactions (no date filter for now)
  const filteredTransactions = useMemo(() => {
    if (!data?.transaction) return [];
    return data.transaction; // Show all transactions
  }, [data?.transaction]);

  const ledgerRows = useMemo(() => {
    if (!data?.customer || filteredTransactions.length === 0) return [];

    // Get opening balance (total balance minus today's transactions)
    const totalDebit = filteredTransactions
      .filter((t: any) => t.type === "Due Sale")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const totalCredit = filteredTransactions
      .filter((t: any) => t.type !== "Due Sale")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    let runningBalance = (data.customer.currentBalance || 0) - totalDebit + totalCredit;

    return [...filteredTransactions]
      .reverse()
      .map((item: any) => {
        const isDue = item.type === "Due Sale";
        const debit = isDue ? item.amount : 0;
        const credit = !isDue ? item.amount : 0;

        runningBalance = runningBalance + debit - credit;

        return {
          ...item,
          debit,
          credit,
          balance: runningBalance,
        };
      });
  }, [data, filteredTransactions]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalDebit = ledgerRows.reduce((sum, row) => sum + (row.debit || 0), 0);
    const totalCredit = ledgerRows.reduce((sum, row) => sum + (row.credit || 0), 0);
    const finalBalance = ledgerRows.length > 0
      ? ledgerRows[ledgerRows.length - 1].balance
      : (data?.customer?.currentBalance || 0);

    return { totalDebit, totalCredit, finalBalance };
  }, [ledgerRows, data?.customer?.currentBalance]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refetch]);

  // Show loading only if we don't have data yet
  if (isLoading && !data) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <ActivityIndicator size="large" color="#fdb714" />
        <Text className="text-white mt-4">Loading Ledger...</Text>
      </View>
    );
  }

  // Show error state if no customer data
  if (!data?.customer) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <Ionicons name="alert-circle-outline" size={60} color="gray" />
        <Text className="text-gray-400 text-lg mt-4">Customer not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-dark">
      <StatusBar style="light" backgroundColor="#000" />

      {/* Customer Info Card */}
      <View className="bg-black-200 mx-2 mt-2 p-4 rounded-xl">
        <Text className="text-white text-xl font-bold">
          {data?.customer?.name}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          {data?.customer?.company} • {data?.customer?.phone}
        </Text>
        <View className="h-[1px] bg-white/10 my-2" />
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-300 text-sm">Current Balance</Text>
          <Text className="text-primary text-lg font-bold">
            {data?.customer?.currentBalance?.toLocaleString() || 0} BDT
          </Text>
        </View>
      </View>

      {/* Summary Card */}
      <View className="bg-black-200 mx-2 mb-2 p-4 rounded-xl">
        <View className="flex-row justify-between mb-2">
          <View>
            <Text className="text-gray-400 text-xs">Total Debit</Text>
            <Text className="text-red-500 text-lg font-bold">
              {summary.totalDebit.toLocaleString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-xs">Total Credit</Text>
            <Text className="text-green-500 text-lg font-bold">
              {summary.totalCredit.toLocaleString()}
            </Text>
          </View>
        </View>
        <View className="h-[1px] bg-white/10 my-2" />
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-300 font-semibold">Balance</Text>
          <Text className="text-primary text-xl font-bold">
            {summary.finalBalance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Table Header */}
      <View className="flex-row bg-gray-300 py-2 mx-[1px]">
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Date</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Type</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Debit</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Credit</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Balance</Text>
      </View>

      {/* Ledger List */}
      {ledgerRows.length > 0 ? (
        <FlatList
          data={ledgerRows}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View className="flex-row py-2 bg-white mx-[1px]">
              <Text className="flex-[1] text-[11px] px-1 mx-[1px]">
                {format(new Date(item.createdAt), "dd MMM")}
              </Text>
              <Text className="flex-[1] text-[11px] px-1 mx-[1px]">
                {item.type}
              </Text>
              <Text className="flex-[1] text-[11px] font-semibold text-red-600 px-1 mx-[1px]">
                {item.debit || "-"}
              </Text>
              <Text className="flex-[1] text-[11px] font-semibold text-green-600 px-1 mx-[1px]">
                {item.credit || "-"}
              </Text>
              <Text className="flex-[1] text-[12px] font-bold px-1 mx-[1px]">
                {item.balance}
              </Text>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 justify-center items-center mt-10">
          <Ionicons name="receipt-outline" size={60} color="gray" />
          <Text className="text-gray-400 text-lg mt-4">No transactions found</Text>
          <Text className="text-gray-500 text-sm">for this customer</Text>
        </View>
      )}
    </View>
  );
};

export default CustomerLedger;
