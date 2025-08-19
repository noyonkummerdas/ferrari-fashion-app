import { SearchBar } from "@/components/SearchBar";
import { StockListItem } from "@/components/StockListItem";
import { useProductsQuery } from "@/store/api/productApi";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const StockIndex = () => {
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductsQuery({
      q: searchQuery || "all",
      forceRefetch: true,
    });

  useEffect(() => {
    if (searchQuery) {
      refetch();
    }
    if (isFocused) {
      refetch();
    }
  }, [searchQuery, isFocused]);

  // console.log("STOCK", data, error, isLoading, isFetching, isSuccess);
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleItemPress = (id) => {
    // console.log("Selected item:", item);
    // Navigate to stock details
    router.push(`/(drawer)/(tabs)/(stock)/${id}`);
  };

  const handleAddStock = () => {
    router.push("/(drawer)/(tabs)/(stock)/add-stock");
  };

  return (
    <View className="flex-1 bg-dark">
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products by name or code..."
        />
        {/* <Text className="text-red-500">TEST</Text> */}

        {/* Stock List */}
        {data?.length > 0 &&
          data?.map((item) => (
            <StockListItem
              key={item._id}
              id={item._id}
              style={item.style}
              code={item.code}
              photo={item.photo}
              currentStock={item.currentStock}
              onPress={() => handleItemPress(item._id)}
            />
          ))}
        <StatusBar style="light" />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddStock}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

export default StockIndex;
