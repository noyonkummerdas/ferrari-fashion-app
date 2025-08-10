import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchBar } from "../../../../components/SearchBar";
import { StockListItem } from "../../../../components/StockListItem";

// Sample stock data matching your screenshot
const stockData = [
  { id: "1", name: "Style Hood", code: "001", price: "234234", quantity: "50" },
  { id: "2", name: "Style Hood", code: "002", price: "234234", quantity: "30" },
  { id: "3", name: "Style Hood", code: "003", price: "234234", quantity: "25" },
  {
    id: "4",
    name: "Classic T-Shirt",
    code: "004",
    price: "150000",
    quantity: "100",
  },
  { id: "5", name: "Style Hood", code: "005", price: "234234", quantity: "15" },
  {
    id: "6",
    name: "Denim Jacket",
    code: "006",
    price: "450000",
    quantity: "8",
  },
  { id: "7", name: "Style Hood", code: "007", price: "234234", quantity: "40" },
  {
    id: "8",
    name: "Cotton Polo",
    code: "008",
    price: "180000",
    quantity: "60",
  },
  { id: "9", name: "Style Hood", code: "009", price: "234234", quantity: "20" },
  {
    id: "10",
    name: "Casual Shirt",
    code: "010",
    price: "200000",
    quantity: "35",
  },
];

const StockIndex = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleItemPress = (item: any) => {
    console.log("Selected item:", item);
    // Navigate to stock details
    router.push(`/(drawer)/(tabs)/(stock)/${item.id}`);
  };

  const handleAddStock = () => {
    router.push("/(drawer)/(tabs)/(stock)/add-stock");
  };

  // Filter stock data based on search query
  const filteredStockData = useMemo(() => {
    if (!searchQuery.trim()) {
      return stockData;
    }

    return stockData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-black">
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
        {filteredStockData.map((item) => (
          <StockListItem
            key={item.id}
            id={item.id}
            name={item.name}
            code={item.code}
            price={item.price}
            onPress={() => handleItemPress(item)}
          />
        ))}
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
