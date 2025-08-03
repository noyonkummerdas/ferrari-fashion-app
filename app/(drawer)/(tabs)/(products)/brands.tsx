import { View, Text, SafeAreaView, useColorScheme, TouchableOpacity, TextInput, RefreshControl, Image, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useBrandQuery, useBrandsQuery } from '@/store/api/brandApi';
import BrandListItem from '@/components/brandListItem';


const Brands = () => {
  const {userInfo} = useGlobalContext()
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // useInventoriesQuery
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useBrandsQuery({
      limit:30,
      aamarId,
      q:searchQuery || "all" ,
    });

  useEffect(()=>{
    refetch()
  },[aamarId])

  useEffect(()=>{
   
  },[isSuccess, data])

  const resetData = ()=>{
      setSearchQuery("all")
      refetch()
    }

  // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery("")
    refetch()
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Brand data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className='me-4' >
          <TouchableOpacity onPress={()=>router.push("/brand/add-brand")} className='flex flex-row justify-center items-center gap-1'>
            <Ionicons name="add" size={24}  color="#f2652d" />
            <Text className='text-primary text-xl font-pmedium'> Add</Text>
          </TouchableOpacity>
        </View>
        ),
      title: "Brands",
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
    

    
    
  return (
    <SafeAreaView className='bg-gray-50 h-full'>
       
        <View className='flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-gray-300'>
          <TextInput placeholder={`Search Brand`} className='flex-1' value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline"  size={24} />
        </View>
        
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className=' bg-white'  >
          {
            data && data?.length > 0 && 
            data?.map((brand,index)=>
              <BrandListItem
                key={index} 
                id={brand?._id || ""}
                name={brand.name || ""}
                company={brand.company || ""}
                status={brand?.status || "active"}
              />
            )
          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default Brands