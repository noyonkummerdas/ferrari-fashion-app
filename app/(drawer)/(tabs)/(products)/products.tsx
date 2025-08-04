import ProductItemList from '@/components/productListItem';
import { Colors } from '@/constants/Colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useProductsQuery } from '@/store/api/productApi';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


const Products = () => {
  const {userInfo} = useGlobalContext()
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
  // useInventoriesQuery
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductsQuery({
      warehouse,
      aamarId,
      q:searchQuery || "all" ,
      limit:30,
      forceRefetch: true,
    });



    useEffect(()=>{
      refetch()
    },[aamarId])

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
      console.log("Product data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className='me-4' >
          <TouchableOpacity onPress={()=>router.push("/product/add-product")} className='flex flex-row justify-center items-center gap-2'>
            <Ionicons name="add" size={24}  color="#FDB714" />
            <Text className='text-primary text-xl font-pmedium'>Add</Text>
          </TouchableOpacity>
        </View>
        ),
      title: "Products",
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




// console.log("first",data)

useEffect(()=>{
  if(data && data?.length >0){
     
    }
  }, [data, isSuccess])

  // console.log("DATA::",stockData)
  return (
    <SafeAreaView className='bg-dark h-full'>
        <View className='flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-gray-800'>
          <TextInput placeholder='Search Product' className='flex-1 text-gray-200' value={searchQuery} onChangeText={setSearchQuery} />
          <Ionicons name="search-outline" color='#E5E7EB'  size={24} />
        </View>
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className=' bg-dark'  >
          {
            data && data?.length > 0 && 
            data?.map((product,index)=>
              <ProductItemList 
                key={index} 
                id={product?._id || ""}
                name={product.name || ""}
                photo={product?.photo }
                ean={product?.ean || ""}
                article_code={product.article_code|| ""}
                mrp={product?.mrp || 0}
                tp={product?.tp || 0}
                stock={product?.stock || ""}
                status={product?.status || ""}
                category_name={product?.category_name}
                master_category_name={product?.master_category_name}
              />
            )
          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default Products