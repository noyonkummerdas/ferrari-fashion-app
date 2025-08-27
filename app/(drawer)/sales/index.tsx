import { CustomDrawerToggleButton } from "@/components";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAllSaleQuery } from "@/store/api/saleApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

const SalesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="mr-4 bg-gray-900">
          <TouchableOpacity
           onPress={() => router.push('/sales/createDueSelas')}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="cart-outline" size={20} color="#ffffff" />
            <Text className="text-white text-xl font-medium">Add</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "Sales",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
    });
  }, [navigation]);

  // // API call - only if userInfo exists
  const { data, isSuccess, isError, refetch } = useAllSaleQuery({ warehouse: userInfo?.warehouse, startDate: "08-26-2025" });
  console.log("Raw API response:", data, isSuccess, isError);
  // console.log("Sales array:", data?.sales || data?.data || []);

  // console.log(userInfo)

  // useEffect

  useEffect(()=>{
    refetch()
  },[userInfo?.warehouse])


  // const salesList = Array.isArray(data?.data) ? data.data : data?.data ? [data.data] : [];

  // // Filter by search query
  // const filteredSales = salesList.filter((item) =>
  //   item.customerId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  // );
 
  return (
    <View className="flex-1 bg-dark">
      {/* Search Bar */}
      <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
        <TextInput
          placeholder="Search Customer"
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-300"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search-outline" size={24} color="gray" />
      </View>

{data?.sales?.length > 0 ?

      (<FlatList
        data={data?.sales}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="ml-4 mr-4 mt-4"
            activeOpacity={0.6}
            onPress={() => console.log("Clicked item:", item)}
          >
            <View className="flex-row justify-between p-4 bg-black-200 rounded-lg items-center">
              <View className="flex-col">
                <Text className="text-primary font-bold text-lg">
                  {item.customerName || "Unknown"}
                </Text>
                <Text className="text-gray-200 text-base">
                  {new Date(item.formatedDate).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-col items-end">
                <Text className="text-gray-300 text-base">INV: {item.invoice}</Text>
                <Text>
                  <Text className="text-primary">{item.amount}</Text>
                  <Text className="text-gray-200"> BDT</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        />)
        : 
          <View className="flex-1 h-96 w-full justify-center items-center mt-10">
            <Ionicons name="cart-outline" size={60} color="gray" />
            <Text className="text-primary text-lg mt-4">No sales found</Text>
            <Text className="text-white text-sm">Try selecting another warehouse</Text>
          </View>

}
    </View>
  );
};

export default SalesList;
