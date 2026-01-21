import { CustomDrawerToggleButton } from "@/components";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useCustomerListQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface Customer {
  _id: string;
  name: string;
  invoiceId?: string;
  photo: string;
  phone: string;
  email: string;
  status: string;
  balance?: number;
}

const Customers = () => {
  const router = useRouter();
  const { userInfo } = useGlobalContext();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [customer, setCustomers] = useState<Customer[]>([]);
  const [invoiceCustomer, setInvoiceCustomer] = useState<Customer | null>(null);

  const { data, error, isLoading, refetch } = useCustomerListQuery({
    q: searchQuery || "all",
  });
  // console.log("customer list error", data);
  // console.log("customer list data", data);
  // reset search data
  const resetData = () => {
    setSearchQuery("");
    refetch();
  };
  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  // header customization
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="me-4">
          <TouchableOpacity
            onPress={() => router.push("/customer/add-customer")}
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
    if (data && Array.isArray(data)) {
      setCustomers(data);
    }
  }, [data]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />

      <SafeAreaView className="bg-dark flex-1">
        {/* 🔍 Search Box */}
        <View className="flex flex-row justify-between border rounded-full h-14 items-center px-5 m-2 bg-black-200">
          <TextInput
            placeholder="Search Customer..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-gray-300"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={24} color={"#CDCDE0"} />
        </View>

        {/* 📝 Customer List */}
        <FlatList
          data={customer}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/customer/details/${item._id}`)}
            >
              <View className="flex flex-col justify-between bg-black-200 w-full p-4 rounded-lg mb-4">
                {/* Name + Status */}
                <View className="flex flex-row justify-between items-center gap-2">
                  <Text className="text-white text-lg">{item.name}</Text>
                  <Text className="text-primary text-lg">{item.status}</Text>
                </View>

                {/* Phone + Balance */}
                <View className="flex flex-row justify-between items-center gap-2 mt-2">
                  <View className="flex flex-row items-center gap-1">
                    <Ionicons
                      name="phone-portrait-sharp"
                      size={16}
                      color="#fdb714"
                    />
                    <Text className="text-white text-base">{item.phone}</Text>
                  </View>
                  <Text className="text-white text-lg">
                    {item.balance ?? 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !isLoading && (
              <Text className="text-center text-gray-400 mt-10">
                No customers found
              </Text>
            )
          }
        />
      </SafeAreaView>
      
    </>
  );
};

export default Customers;
