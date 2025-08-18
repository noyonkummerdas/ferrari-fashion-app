import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface Stocks {
  name: string;
  article_code: string;
  currentQty: number;
  stockValue: number;
}

const Stock = () => {
  const { userInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [stockData, setStockData] = useState<Stocks[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useInventoriesQuery(
      { aamarId, warehouse, forceRefetch: true },
      { skip: !aamarId || !warehouse }, // Prevent query if data is missing
    );

  useEffect(() => {
    if (aamarId) refetch();
  }, [aamarId]);

  const resetData = () => {
    setSearchQuery("");
    refetch();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={resetData}>
            <SimpleLineIcons name="refresh" size={24} color="#f2652d" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
      ),
      title: "Stocks - Stock",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "light"].backgroundColor,
      },
      headerTintColor: Colors[colorScheme ?? "light"].text,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "left",
      headerShown: true,
    });
  }, [navigation, colorScheme]);

  const search = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!data) return;

    const filteredData = data.filter(
      (item: Stocks) =>
        item?.name?.toLowerCase().includes(query) ||
        item?.article_code?.toLowerCase().includes(query),
    );

    setStockData(query ? filteredData : data);
  };

  useEffect(() => {
    if (data && isSuccess) {
      setStockData(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    search();
  }, [searchQuery]);

  return (
    <SafeAreaView className="bg-dark h-full">
      <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 mb-2 bg-gray-200">
        <TextInput
          placeholder="Search Stock"
          className="flex-1"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search-outline" size={24} />
      </View>

      <ScrollView>
        {stockData?.length > 0 &&
          stockData.map((stock, index) => (
            <View
              className="px-4 py-3 border-slate-200 border border-b"
              key={index}
            >
              <View className="flex flex-row justify-between gap-2 items-center">
                <Text className="text-lg font-pmedium">{stock.name}</Text>
                <Text className="text-md font-pmedium">
                  Stock: {stock?.currentQty}
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className="text-md font-pregular">
                  Code: {stock.article_code}
                </Text>
                <Text className="text-md font-pregular">
                  Stock Value: {stock?.stockValue}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stock;
