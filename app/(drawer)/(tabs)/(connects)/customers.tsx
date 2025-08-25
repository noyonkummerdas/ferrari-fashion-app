import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
// import { useInventoriesQuery } from '@/store/api/inventoryApi';

import { CustomDrawerToggleButton } from "@/components";
import { useCustomerListQuery } from "@/store/api/customerApi";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";

interface Customer {
  _id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  status: string;
}

const Customers = () => {
  const router = useRouter();
  const { userInfo } = useGlobalContext();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  // const [stockData, setStockData] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [customer, setCustomer] = useState<Customer[]>([]);

  // console.log("CUSTOMER DATA", customer);
  // useInventoriesQuery
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useCustomerListQuery({
      q: searchQuery || "all",
      forceRefetch: true,
    });

  const resetData = () => {
    setSearchQuery("");
    refetch();
  };

  // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery("all");
    refetch();
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Customer data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="me-4 bg-dark">
          <TouchableOpacity
            onPress={() => router.push("/customer/[id]")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="person-add" size={18} color="#ffffff" />
            <Text className="text-white text-xl font-pmedium">Add</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "Customers",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      //@ts-ignore
      headerTintColor: `#ffffff`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
    });
  }, [navigation]);

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  // console.log("DATA::", data);

  return (
    <>
      <StatusBar style="light" backgroundColor="#1f2937" />

      <SafeAreaView className="bg-dark h-full">
        <View className="flex flex-row justify-between border boder-gray-200 rounded-full h-14 items-center px-5 m-2 bg-black-200">
          <TextInput
            placeholder="Search Customer..."
            className="placeholder:text-gray-100 flex-1 text-gray-300 "
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={24} color={"#CDCDE0"} />
        </View>
        {/* <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          className=" bg-white"
        >
          {data?.length > 0 &&
            data.map((customer, index) => (
              <TouchableOpacity
                onPress={() => router.push(`/customer/${customer._id}`)}
                className="px-4 py-4 flex flex-row gap-3 justify-between items-center border-slate-200  border-b"
                key={index}
              >
                <Image className="h-16 w-16 rounded-full" source={profile} />
                <View className="flex-1 flex gap-2 py-2 justify-between">
                  <View className="flex flex-row justify-between gap-2 items-start ">
                    <Text className="text-lg font-pmedium flex-1">
                      {customer.name}
                    </Text>
                    <View className="flex flex-row gap-2 items-center">
                      <Ionicons name="call" size={18} color="#f2652d" />
                      <Text className="text-lg font-pmedium">
                        {customer?.phone}
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-row justify-between items-center ">
                    <View className="flex flex-row gap-2 items-center">
                      <Ionicons name="mail-outline" size={18} color="#f2652d" />
                      <Text className="text-md font-pregular">
                        {customer.email || "No Email"}
                      </Text>
                    </View>
                    <Text className="text-md font-pregular">
                      {customer.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView> */}

        <ScrollView>
          {data?.map((cdata, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/customer/details/${cdata._id}`)}
            >
              <View className="flex flex-col justify-between item-center bg-black-200 w-[380px] h-[84px] p-4 rounded-lg mb-4 mx-auto  ">
                <View className="flex flex-row justify-between items-center gap-2">
                  <Text className="text-white text-lg ">{cdata.name}</Text>
                  <Text className="text-primary text-lg ">{cdata.status}</Text>
                </View>
                <View className="flex flex-row justify-between items-center gap-2">
                  <Text className="text-white text-base item-center">
                    <Ionicons
                      name="phone-portrait-sharp"
                      size={16}
                      color="#fdb714"
                    />
                    {cdata.phone}
                  </Text>
                  <Text className="text-white text-lg">
                    {cdata.balance ?? 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Customers;
