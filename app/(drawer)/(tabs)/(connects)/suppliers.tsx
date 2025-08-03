import { View, Text, SafeAreaView, useColorScheme, TouchableOpacity, TextInput, RefreshControl, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useNavigation, useRouter } from 'expo-router';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
// import { useInventoriesQuery } from '@/store/api/inventoryApi';
import profile from "../../../../assets/images/profile.jpg"

import { ScrollView } from 'react-native-gesture-handler';
import { useSuppliersQuery } from '@/store/api/supplierApi';

interface Customer {
  _id : string;
  name: String;
  photo: String;
  phone: String;
  email: String;
  status: String;
}


const Suppliers = () => {
  const router = useRouter();
  const {userInfo} = useGlobalContext()
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
      aamarId,
      limit:30,
      forceRefetch: true,
    });

console.log(error)

    useEffect(()=>{
      refetch()
    },[aamarId])

  const resetData = ()=>{
    setSearchQuery("")
    refetch()
  }

    // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery("")
    refetch()
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Supplier data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className='me-4' >
          <TouchableOpacity onPress={()=>router.push("/supplier/add-supplier")} className='flex flex-row justify-center items-center gap-2'>
            <Ionicons name="person-add" size={18}  color="#f2652d" />
            
            <Text className='text-primary text-xl font-pmedium'>Add</Text>
          </TouchableOpacity>
        </View>
        ),
      title: "Suppliers",
      //@ts-ignore
      headerStyle: { backgroundColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}` },
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}`,
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: 'left',
      headerShown: true,
      
    });
  }, [navigation]);



  useEffect(()=>{
    refetch()
  }, [searchQuery])

  // console.log("DATA::",data)
  return (
    <SafeAreaView className='bg-white h-full'>
        <View className='flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-slate-200'>
          <TextInput placeholder='Search Supplier' className='flex-1' value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline"  size={24} />
        </View>
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className=' bg-white'  >
          {
            data?.length > 0 && 
            data.map((customer,index)=>
              <TouchableOpacity onPress={()=>router.push(`/supplier/${customer._id}`)} className='px-4 py-4 flex flex-row gap-3 items-center justify-between border-slate-200  border-b' key={index}>
                 <Image className='h-16 w-16 rounded-full' source={profile} />
                <View className='flex-1 flex gap-2 py-2 justify-between'>
                  <View className='flex flex-row justify-between gap-2 items-start '>
                    <Text className='text-lg font-pmedium flex-1'>{customer.name}</Text>
                    <View className='flex flex-row gap-2 items-center'>
                      <Ionicons name="call" size={18} color="#f2652d" />
                      <Text className='text-lg font-pmedium'>{customer?.phone}</Text>
                    </View>
                  </View>
                  <View className='flex flex-row justify-between items-center '>
                     <View className='flex flex-row gap-2 items-center'>
                      <Ionicons name="mail-outline" size={18} color="#f2652d" />
                    <Text className='text-md font-pregular'>{customer.email || "No Email"}</Text>
                    </View>
                    <Text className='text-md font-pregular'>{customer.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default Suppliers