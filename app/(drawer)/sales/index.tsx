import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { TextInput, useColorScheme } from "react-native";
import { addDays, format, isToday, subDays } from "date-fns";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useCustomerListQuery } from "@/store/api/customerApi";
import { ScrollView } from "react-native-gesture-handler";
const SalesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
     const colorScheme = useColorScheme();

    const navigation = useNavigation();
      useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View className="me-4 bg-dark">
              <TouchableOpacity
                onPress={() => router.push("/sales/createDueSelas")}
                className="flex flex-row justify-center items-center gap-2"
              >
                <Ionicons name="person-add" size={18} color="#ffffff" />
                <Text className="text-white text-xl font-pmedium">Add</Text>
              </TouchableOpacity>
            </View>
          ),
          title: "Sales",
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

      const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useCustomerListQuery({
      q: searchQuery || "all",
      forceRefetch: true,
    });

  const resetData = () => {
    setSearchQuery("");
    refetch();
  };


      // const data =[
      //   {
      //     name:'Noyon Das',
      //     invoice: 'INV 012',
      //     amount: 20000,
      //     note: 'This is the first transction ',
      //     date: '12-12-2012',
      //     company:'Sahabag fashion',
      //     "status": "complete"

          
      //   },
      //   {
      //     name:'Abdul khan Malek',
      //     invoice: 'INV 012',
      //     amount: 20000,
      //     note: 'This is the first transction ',
      //     date: '12-12-2012',
      //     company:'Sahabag fashion',
      //     "status": "complete"

          
      //   },
      //   {
      //     name:'Madu',
      //     invoice: 'INV 012',
      //     amount: 20000,
      //     note: 'This is the first transction ',
      //     date: '12-12-2012',
      //     company:'Sahabag fashion',
      //     "status": "complete"

          
      //   },
      //   {
      //     name:'Jadu',
      //     invoice: 'INV 012',
      //     amount: 20000,
      //     note: 'This is the first transction ',
      //     date: '12-12-2012',
      //     company:'Sahabag fashion',
      //     "status": "complete"

          
      //   },
      //   {
      //     name:'Korim',
      //     invoice: 'INV 012',
      //     amount: 20000,
      //     note: 'This is the first transction ',
      //     date: '12-12-2012',
      //     company:'farrari-city',
      //     "status": "complete"

          
      //   },
      //   {
      //     name:'Rohim',
      //     invoice: 'INV 012',
      //     amount: 20000,
      //     note: 'This is the first transction ',
      //     date: '12-12-2012',
      //     company:'fararri-fashion',
      //     "status": "complete"

          
      //   },
      // ]

      

  return (
      <>

      <View className="flex flex-row justify-between border boder-gray-200 rounded-full h-14 items-center px-5 m-2 bg-black-200">
          <TextInput
            placeholder="Search Customer"
            className="placeholder:text-gray-100 flex-1 text-gray-300 "
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={24} color={"primary"} />
        </View>
  
        <FlatList
         data={data}
         keyExtractor={(_, index) => index.toString()}
         renderItem={({ item }) => (
           <TouchableOpacity
             className="ms-4 me-4 mt-4"
             activeOpacity={0.6} // lower = more fade
             onPress={() => console.log('Clicked item:', item)}
           >
             <View className="flex-row justify-between p-4 bg-black-200 rounded-lg items-center">
               <View className="flex-col">
                 <Text className="text-primary font-bold text-lg">{item.name}</Text>
                 <Text className="text-gray-200 text-">{item.date}</Text>
               </View>
               <View className="flex-col items-end">
                
                 <Text className="text-gray-300 text-bsed">INV: {item.invoice}</Text>
                 <Text>
                   <Text className="text-primary">{item.amount}</Text>
                   <Text className="text-gray-200"> BDT</Text>
                 </Text>
               </View>
             </View>
    </TouchableOpacity>
  )}
/>


  </>
  );
};

export default SalesList;