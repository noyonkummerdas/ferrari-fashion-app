 import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
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

import { useSupplierExportQuery, useSupplierQuery, useSuppliersQuery } from "@/store/api/supplierApi";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

const CustomDrawerToggleButton = ({ tintColor = "#FDB714" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="menu" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};

interface Customer {
  _id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  status: string;
}

const Suppliers = ({}) => {
  const router = useRouter();
  const { userInfo } = useGlobalContext()
 const {id} = useLocalSearchParams()
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  // const [stockData, setStockData] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // useInventoriesQuery
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSuppliersQuery({
      q: searchQuery || "all",
      forceRefetch: true,
    });
console.log("SUPPLIER LIST DATA::", data);
  // console.log(data);
 const { data: invoiceData, isSuccess: invoiceIdSuccess, isError: invoiceIdError } = useSupplierExportQuery(searchQuery, {
  skip: !searchQuery, //
})
const [currentDate, setCurrentDate] = useState(new Date());
 const { data: supplierData, refetch: refetchSupplier } = useSupplierQuery({
    _id: id,
    date: currentDate.toISOString(),
    isDate: 'month',
    forceRefetch: true,
  });
  console.log("SUPPLIER DATA::", supplierData);
  
  useEffect(() => {
    refetch();
  }, [aamarId]);

  const resetData = () => {
    setSearchQuery("");
    refetch();
  };

  // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery("");
    refetch();
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Supplier data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="me-4">
          <TouchableOpacity
            onPress={() => router.push("/supplier/add-supplier")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="person-add" size={18} color="#ffffff" />

            <Text className="text-white text-xl font-pmedium">Add</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "Suppliers",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      //@ts-ignore
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "white" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  // console.log("DATA::",data)
  return (
    <SafeAreaView className="bg-dark h-full">
      <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
        <TextInput
          placeholder="Search Supplier"
          className="placeholder:text-gray-100 flex-1 text-gray-300 "
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search-outline" size={24} color={"#CDCDE0"}/>
      </View>

      <ScrollView>
        {data?.map((data) => (
          <TouchableOpacity
            key={data._id}
            onPress={() => router.push(`/supplier/details/${data._id}`)}
          >
            <View className="flex flex-col justify-between item-center bg-black-200 w-[380px] h-[84px] p-4 rounded-lg mb-4 mx-auto  ">
              <View className="flex flex-row justify-between items-center w-full gap-2">
                <Text className="text-white text-lg ">{data.name}</Text>
                <Text className="text-primary text-md ">{data.status}</Text>
              </View>
              <View className="flex flex-row justify-between items-center gap-2">
                <Text className="text-white text-base item-center">
                  <Ionicons
                    name="phone-portrait-sharp"
                    size={16}
                    color="#fdb714"
                  />
                  {data.phone}
                </Text>
                <Text className="text-white text-lg">{data.balance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Suppliers;
