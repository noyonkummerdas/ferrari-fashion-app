import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar, TextInput, useColorScheme } from "react-native";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { usePurchasesDWQuery, usePurchaseSupplierQuery } from "@/store/api/purchasApi";
import { useGlobalContext } from "@/context/GlobalProvider";




// const data = [
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
//   {
//     name:'Ashok',
//     invoice:'INV 101',
//     date:'12-12-2012',
//     amount:10000,
//     note:'Note some this',
//     // photo: require('../assets/images/sample.png')

//   },
// ]

const PurchasesList = () => {
     const colorScheme = useColorScheme();
     const { userInfo } = useGlobalContext();
     const [searchQuery, setSearchQuery] = useState("");



     const { data, isSuccess, isError, refetch } = usePurchasesDWQuery({ warehouse: userInfo?.warehouse, date: "08-27-2025" });
     console.log('data', data, isSuccess, isError)

     useEffect(()=>{
       refetch()
     },[userInfo?.warehouse])
     
     


    const navigation = useNavigation();
      useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View className="me-4 bg-dark">
              <TouchableOpacity
                onPress={() => router.push("/purchases/create-purchase")}
                className="flex flex-row justify-center items-center gap-2"
              >
                <Ionicons name="bag-add" size={20} color="#ffffff" />
                <Text className="text-white text-xl font-pmedium">Add</Text>
              </TouchableOpacity>
            </View>
          ),
          title: "Purchases",
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

  return (
    <>

<View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
     <TextInput
       placeholder="Search Supplire"
       className="placeholder:text-gray-100 flex-1 text-gray-300 "
       value={searchQuery}
       onChangeText={setSearchQuery}
     />
     <Ionicons name="search-outline" size={24} color={"gray"} />
   </View>
    <FlatList
    data={data}                           // 
    keyExtractor={(item, index) => item._id || index.toString()}    // 
    renderItem={({ item }) => (
      <TouchableOpacity
      className=""
      activeOpacity={0.6} // lower = more fade
      onPress={() => router.push(`/purchases/${item._id}`)}

    >

      <View className="flex-row justify-between p-4 bg-black-200 rounded-lg ms-4 me-4 mt-4 items-center">
        <View className="flex-col">
        <View className="flex-row items-center">
        
            <View>
              <Text className="text-primary text-lg ">{item?.supplierName}</Text>
              <Text className="text-gray-200">{item?.formatedDate}</Text>
              
            </View>
        </View>
        </View>
        
        <View className="flex-col items-end">

        <Text className="text-gray-200 text-lg"> INV: {item?.invoice}</Text>
          <Text className="text-primary ">{item?.amount} <Text className="text-gray-200">BDT</Text></Text>
        </View>
      </View>
      </TouchableOpacity>
    )}
  />
  </>
  );
};

export default PurchasesList;