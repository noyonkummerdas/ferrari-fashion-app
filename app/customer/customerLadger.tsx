import { useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const CustomerLedger = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { data, isLoading } = useGetCustomerByIdQuery({ id });

  console.log("customer id", id);
  console.log("customer data", data);

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  const ledgerRows = useMemo(() => {
    if (!data?.customer || !data?.transaction) return [];

    let runningBalance = data.customer.balance ?? 0;

    return [...data.transaction]
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
  }, [data]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Loading Ledger...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4 pt-4">
      <StatusBar style="light" />

      {/* Customer Info */}
      <View className="mb-4">
        <Text className="text-white text-xl font-bold">
          {data?.customer?.name}
        </Text>
        <Text className="text-gray-400 text-sm">
          {data?.customer?.company} • {data?.customer?.phone}
        </Text>
        <Text className="text-green-400 text-base mt-1">
          Current Balance: {data?.customer?.currentBalance}
        </Text>
      </View>

      {/* Table Header */}
      <View className="flex-row border-b border-gray-700 py-2">
        <Text className="flex-1 text-center text-yellow-400 text-xs font-semibold">
          Date
        </Text>
        <Text className="flex-1 text-center text-yellow-400 text-xs font-semibold">
          Type
        </Text>
        <Text className="flex-1 text-center text-yellow-400 text-xs font-semibold">
          Debit
        </Text>
        <Text className="flex-1 text-center text-yellow-400 text-xs font-semibold">
          Credit
        </Text>
        <Text className="flex-1 text-center text-yellow-400 text-xs font-semibold">
          Balance
        </Text>
      </View>

      {/* Ledger List */}
      <FlatList
        data={ledgerRows}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="flex-row border-b border-gray-800 py-3">
            <Text className="flex-1 text-center text-gray-200 text-xs">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text className="flex-1 text-center text-gray-200 text-xs">
              {item.type}
            </Text>
            <Text className="flex-1 text-center text-red-400 text-xs">
              {item.debit ? item.debit : "-"}
            </Text>
            <Text className="flex-1 text-center text-green-400 text-xs">
              {item.credit ? item.credit : "-"}
            </Text>
            <Text className="flex-1 text-center text-gray-100 text-xs">
              {item.balance}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default CustomerLedger;
