import { CustomDrawerToggleButton } from "@/components";
import { SearchBar } from "@/components/SearchBar";
import { StockListItem } from "@/components/StockListItem";
import { useProductsQuery } from "@/store/api/productApi";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router, useNavigation, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
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

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Stocks",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`,
      },
      //@ts-ignore
      headerTintColor: `#ffffff`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
      headerRight: () => (
        <View className="me-4">
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(tabs)/(stock)/add-stock")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <MaterialIcons name="inventory" size={22} color="#ffffff" />
            <Text className="text-gray-200 text-lg" >Add</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

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

         {/* Search Bar */}
         <View className="flex flex-row justify-between border rounded-full h-14 items-center px-2 m-2 bg-black-200">
          <TextInput
            placeholder="Search by name code"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            className="fle2x-1 text-gray-300"
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={24} color={"#CDCDE0"} />
        </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
       
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
      {/* <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center"
        onPress={handleAddStock}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#000000" />
      </TouchableOpacity> */}
    </View>
  );
};

export default StockIndex;
