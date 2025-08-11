import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";


import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
// import { useInventoriesQuery } from '@/store/api/inventoryApi';
import profile from "../../../../assets/images/profile.jpg";

import { CustomDrawerToggleButton } from "@/components";
import { useCustomerListQuery } from "@/store/api/customerApi";
import { StatusBar } from 'expo-status-bar';
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
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  // const [stockData, setStockData] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  // useInventoriesQuery
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useCustomerListQuery({
      q: searchQuery || "all",
      aamarId,
      limit: 30,
      forceRefetch: true,
    });

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
      headerTitleAlign: "left",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
    });
  }, [navigation]);

  useEffect(() => {
    refetch();
  }, [searchQuery]);



  // console.log("DATA::",data)


//demo data for customer 


const Customer = [
  {
    name: 'Sir Manishankar Vakta',
    mobile : ' 01683723969',
    address: 
      'uttora #house 12 road-21',
    
    openingBlance: '230000 BDT'
  },
  {
    name: 'Nk Noyon kumar das',
    mobile : ' 01936447781',
    address: 
      'uttora #house 12 road-21',
    
    openingBlance: '230000 BDT'
  },
  {
    name: 'Morshed',
    mobile : ' 01626531980',
    address: 'uttora #house 12 road-21',
    openingBlance: '230000 BDT'
  },
  {
    name: 'Morshed',
    mobile : ' 01626531980',
    address: 'uttora #house 12 road-21',
    openingBlance: '230000 BDT'
  },
  {
    name: 'Morshed',
    mobile : ' 01626531980',
    address: 'uttora #house 12 road-21',
    openingBlance: '230000 BDT'
  },
  {
    name: 'Morshed',
    mobile : ' 01626531980',
    address: 'uttora #house 12 road-21',
    openingBlance: '230000 BDT'
  },
  {
    name: 'Morshed',
    mobile : ' 01626531980',
    address: 'uttora #house 12 road-21',
    openingBlance: '230000 BDT'
  },
  {
    name: 'Morshed',
    mobile : ' 01626531980',
    address: 'uttora #house 12 road-21',
    openingBlance: '230000 BDT'
  },
]

  return (
    <>
    <StatusBar style="light" backgroundColor="#1f2937" />

    <SafeAreaView className="bg-dark h-full">
       <View className='flex flex-row justify-between border boder-gray-200 rounded-full h-14 items-center px-5 m-2 bg-black-200'>
          <TextInput placeholder='Search Supplier' className='placeholder:text-gray-100 flex-1 text-gray-300 ' value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline"  size={24} color={'#CDCDE0'} />
        </View>
      <ScrollView
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
      </ScrollView>


      <ScrollView>
          
           {
 Customer.map((cdata, index)=>(
  <TouchableOpacity key ={index}onPress={()=>router.push("/customer/customerDatiles")} >
      <View className='flex flex-col justify-between item-center bg-black-200 w-[380px] h-[84px] p-4 rounded-lg mb-4 mx-auto  '>
     <View >
      <Text className='text-white w-[178px] text-lg '>{cdata.name}</Text>
      
      </View>
      <View className='flex flex-row justify-between items-center gap-2'>
        <Text className='text-white text-base item-center'><Ionicons name="phone-portrait-sharp" size={16} color="#fdb714" />{cdata.mobile}</Text>
        <Text className='text-primary font-2xl'>{cdata.openingBlance}</Text>
      </View>
  </View>


   </TouchableOpacity>

))

           }
          
        </ScrollView>

    </SafeAreaView>

    </>
  );
  
};

export default Customers;
