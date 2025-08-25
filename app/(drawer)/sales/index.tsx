import { CustomDrawerToggleButton } from "@/components";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAllSaleQuery } from "@/store/api/saleApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
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
            onPress={() => router.push("/sales/createDueSelas")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="person-add" size={18} color="#ffffff" />
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

  const { data, refetch } = useAllSaleQuery({
    // q: searchQuery || "all",
    startDate: new Date().toISOString(),
    warehouse: userInfo?.warehouse,
    forceRefetch: true,
  });

  console.log(data)

  // console.log(userInfo);

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="flex flex-row justify-between border border-gray-200 rounded-full h-14 items-center px-5 m-2 bg-black-200">
        <TextInput
          placeholder="Search Customer"
          className="placeholder:text-gray-100 flex-1 text-gray-300"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search-outline" size={24} color="gray" />
      </View>

      {/* FlatList */}
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="ml-4 mr-4 mt-4"
            activeOpacity={0.6}
            onPress={() => console.log("Clicked item:", item)}
          >
            <View className="flex-row justify-between p-4 bg-black-200 rounded-lg items-center">
              <View className="flex-col">
                <Text className="text-primary font-bold text-lg">{item.name}</Text>
                <Text className="text-gray-200 text-base">{item.date}</Text>
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
      />
    </View>
  );
};

export default SalesList;
