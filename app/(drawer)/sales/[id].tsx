import { Colors } from "@/constants/Colors";
import { useSaleQuery } from "@/store/api/saleApi";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const SalesDetails = () => {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const { data, isLoading, error, isSuccess } = useSaleQuery(id as string);

  // console.log('error',data, isSuccess, error)

  // console.log("sale data:",data);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Sales Details",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);

  if (isLoading || !data) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-white mt-4 text-lg">Loading Sale details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <Text className="text-red-500 text-lg">Error loading sale details</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-400";
      case "due":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "paid":
        return "text-red-400";
      case "due":
        return "text-green-400";
      default:
        return "text-blue-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "paid":
        return "remove-circle";
      case "due":
        return "add-circle";
      default:
        return "swap-horizontal";
    }
  };

  return (
    <>
    <ScrollView className="flex-1 bg-dark">
      {/* Header Card */}
      <View className="mx-4 mt-6 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-3">
              <Ionicons name={getTypeIcon(data?.type)} size={24} color="#ffffff" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold capitalize">
                {data?.type}
              </Text>
              <Text className="text-white/80 text-sm">
                Transaction #{data?.invoiceId}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-white/80 text-sm">Amount</Text>
            <Text className="text-white text-2xl font-bold">
              ৳{data?.amount?.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="bg-white/20 rounded-lg px-3 py-2">
            <Text className="text-white/80 text-xs">Status</Text>
            <Text className={`text-white font-semibold capitalize ${getStatusColor(data?.status)}`}>
              {data?.status}
            </Text>
          </View>
          <View className="bg-white/20 rounded-lg px-3 py-2">
            <Text className="text-white/80 text-xs">Date</Text>
            <Text className="text-white font-semibold">
              {data?.date && format(new Date(data?.date), "dd MMM yyyy")}
            </Text>
          </View>
        </View>
      </View>

      {/* Transaction Details */}
      <View className="mx-4 mt-6 bg-black-200 rounded-2xl p-6">
        <Text className="text-white text-xl font-semibold mb-4">Transaction Details</Text>

        <View className="space-y-4">
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Customer</Text>
            <Text className="text-white text-base font-medium">
              {data?.customerId?.name || "N/A"}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Transaction Code</Text>
            <Text className="text-white text-base font-medium font-mono">{data?.invoiceId}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Date & Time</Text>
            <Text className="text-white text-base font-medium">
              {data?.date && format(new Date(data?.date), "dd MMM yyyy, h:mm a")}
            </Text>
          </View>

          {/* <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Type</Text>
            <Text className={`text-base font-medium capitalize ${getTypeColor(data?.type)}`}>
              {data?.type}
            </Text>
          </View> */}

          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Status</Text>
            <Text className={`text-base font-medium capitalize ${getStatusColor(data?.status)}`}>
              {data?.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Balance Information */}
      <View className="mx-4 mt-6 bg-black-200 rounded-2xl p-6">
        <Text className="text-white text-xl font-semibold mb-4">Balance Information</Text>

        <View className="space-y-4">
          {/* <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Opening Balance</Text>
            <Text className="text-white text-base font-medium">
              ৳{data?.openingBalance?.toLocaleString()}
            </Text>
          </View> */}

          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-gray-300 text-base">Transaction Amount</Text>
            <Text className="text-red-400 text-base font-medium">
              -৳{data?.amount?.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-3">
            <Text className="text-white text-lg font-semibold">New Balance</Text>
            <Text className="text-white text-lg font-bold">
              ৳{data?.currentBalance?.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Additional Information */}
      {(data?.note || data?.invoiceId) && (
        <View className="mx-4 mt-6 bg-black-200 rounded-2xl p-6 mb-6">
          <Text className="text-white text-xl font-semibold mb-4">Additional Information</Text>

          {data?.note && (
            <View className="mb-4">
              <Text className="text-gray-300 text-base mb-2">Note</Text>
              <Text className="text-white text-base bg-gray-700 rounded-lg p-3">{data?.note}</Text>
            </View>
          )}

          {data?.invoiceId && (
            <View className="mb-4">
              <Text className="text-gray-300 text-base mb-2">Invoice Reference</Text>
              <Text className="text-white text-base bg-gray-700 rounded-lg p-3 font-mono">
                {data?.invoiceId}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Back Button */}
      <View className="mx-4 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black-200 py-4 rounded-xl items-center"
        >
          <Text className="text-white text-lg font-semibold">Back to Sales List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    <StatusBar style="light" />
    </>
  );
};

export default SalesDetails;
