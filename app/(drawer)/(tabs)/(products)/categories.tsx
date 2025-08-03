import { View, Text, SafeAreaView, useColorScheme, TouchableOpacity, TextInput, RefreshControl, Image, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import CategoryListItem from '@/components/categoryListItem';
import { useCategoryListQuery, useMasterCategoryListQuery } from '@/store/api/categoryApi';

const Categories = () => {
  const {userInfo} = useGlobalContext()
    const aamarId = userInfo?.aamarId;
    const warehouse = userInfo?.warehouse;
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [isCat, setIsCat] = useState(true);
    const [data, setData] = useState([]);

    // useInventoriesQuery
    const { data:categories, error, isLoading, isFetching, isSuccess, refetch } =
      useMasterCategoryListQuery({
        aamarId,
        q:searchQuery || "all" ,
        limit:30,
        forceRefetch: true,
      });
    const { data:subCategory, error:subError,isSuccess:subSuccess, refetch:subRefatch} =
      useCategoryListQuery({
        aamarId,
        q:searchQuery || "all" ,
        mcId: "all",
        limit:30,
        forceRefetch: true,
      });
      
  
  
    useEffect(()=>{
      refetch()
    },[aamarId])

    useEffect(()=>{
      if(isCat && categories && categories?.length > 0){
        // console.log("Categories",categories)
        setData(categories)
      }else{
        // console.log("Categories",subCategory)
        setData(subCategory)
      }
    },[isCat,categories, subCategory,subSuccess, isSuccess])

    
  
    const resetData = ()=>{
      setSearchQuery("all")
      isCat ? refetch(): subRefatch()

    }
  
      // Function to fetch updated data
    const onRefresh = () => {
      setRefreshing(true);
      setSearchQuery("")
      isCat ? refetch(): subRefatch()
      // Simulate fetching dashboard data
      setTimeout(() => {
        console.log("Category data refreshed!");
        setRefreshing(false);
      }, 1500);
    };
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View className='me-4' >
            <TouchableOpacity onPress={()=>router.push({pathname:"/category/add-category",params: {isCat: isCat ? "category" : "sub_category"}})} className='flex flex-row justify-center items-center gap-1'>
              <Ionicons name="add" size={24}  color="#f2652d" />
              <Text className='text-primary text-xl font-pmedium'> Add</Text>
            </TouchableOpacity>
          </View>
          ),
        title: isCat ? "Categories" : "Sub Categories",
        //@ts-ignore
        headerStyle: { backgroundColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}` },
        //@ts-ignore
        headerTintColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}`,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerShown: true,
      });
    }, [navigation, isCat]);
  
  
  
  
  
  return (
    <SafeAreaView className='bg-gray-50 h-full'>
       <View className='flex flex-row justify-between items-center px-2 gap-4 my-1'>
          <TouchableOpacity onPress={()=>setIsCat(true)} 
            className={`border border-primary p-3 px-4 rounded-full flex-1 justify-center items-center ${isCat ? 'bg-primary' : ''}`}
>
            <Text className={`text-xl font-pmedium ${isCat ? 'text-white' : ''}`}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setIsCat(false)} 
            className={`border border-primary p-3 px-4 rounded-full flex-1 justify-center items-center ${!isCat ? 'bg-primary' : ''}`}
>
            <Text className={`text-xl font-pmedium ${!isCat ? 'text-white' : ''}`}>Sub Categories</Text>
          </TouchableOpacity>
        </View>
        <View className='flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-gray-300'>
          <TextInput placeholder={`Search ${isCat ? "Categories" : "Sub Category"}`} className='flex-1' value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline"  size={24} />
        </View>
        
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className=' bg-white'  >
          {
            data && data?.length > 0 && 
            data?.map((category,index)=>
              <CategoryListItem
                key={index} 
                id={category?._id || ""}
                name={category.name || ""}
                code={category.code|| ""}
                mcId={category?.mcId || ""}
                mc_name={category?.mc_name || ""}
                status={category?.status || "active"}
                group={category?.group || ""}
                mc={category?.mc || null}
              />
            )
          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default Categories