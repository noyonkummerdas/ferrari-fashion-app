import { Colors } from '@/constants/Colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Image, RefreshControl, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
// import { useInventoriesQuery } from '@/store/api/inventoryApi';
import profile from "../../../../assets/images/profile.jpg";

import { useSuppliersQuery } from '@/store/api/supplierApi';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';




import { DrawerActions, useNavigation } from '@react-navigation/native';


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
            <Ionicons name="person-add" size={18}  color="#ffffff" />
            
            <Text className='text-white text-xl font-pmedium'>Add</Text>
          </TouchableOpacity>
        </View>
        ),
      title: "Suppliers",
      //@ts-ignore
      headerStyle: { backgroundColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}` },
      //@ts-ignore
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
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


  const [newSupplire, setSupplire]= useState('')


  const supplire = [
    {
      name: 'Monisankor vakto',
      mobile : ' 01683723969',
      address: 
        'uttora #house 12 road-21',
      
      openingBlance: 230000
    },
    {
      name: 'Nk Noyon kumar das',
      mobile : ' 01936447781',
      address: 
        'uttora #house 12 road-21',
      
      openingBlance: 230000
    },
    {
      name: 'Morshed',
      mobile : ' 01626531980',
      address: 'uttora #house 12 road-21',
      openingBlance: 230000
    },
    {
      name: 'Morshed',
      mobile : ' 01626531980',
      address: 'uttora #house 12 road-21',
      openingBlance: 230000
    },
    {
      name: 'Morshed',
      mobile : ' 01626531980',
      address: 'uttora #house 12 road-21',
      openingBlance: 230000
    },
    {
      name: 'Morshed',
      mobile : ' 01626531980',
      address: 'uttora #house 12 road-21',
      openingBlance: 230000
    },
    {
      name: 'Morshed',
      mobile : ' 01626531980',
      address: 'uttora #house 12 road-21',
      openingBlance: 230000
    },
    {
      name: 'Morshed',
      mobile : ' 01626531980',
      address: 'uttora #house 12 road-21',
      openingBlance: 230000
    },
  ]

  // console.log("DATA::",data)
  return (
    <SafeAreaView className='bg-dark h-full'>
        <View className='flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-gray-700'>
          <TextInput placeholder='Search Supplier' className='flex-1  ' value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline"  size={24} />
        </View>
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className=' '  >
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

        <ScrollView>
          {
            supplire.map((sdata, index)=>
              <View className='flex flex-row justify-between item-center bg-gray-500 w-[400px] h-[84px] p-4 rounded-lg mb-4 mx-auto  '>
                 
                 <View>
                  <Text className='text-white w-[178px] text-lg '>{sdata.name}</Text>
                  <Text className='text-white'>{sdata.mobile}</Text>
                  </View>
                  <View>
                    <Text className='text-primary font-lg'>{sdata.openingBlance}</Text>
                  </View>
              </View>
            
            )
          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default Suppliers