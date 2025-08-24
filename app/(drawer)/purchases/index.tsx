import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";




const data = [
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
  {
    name:'Ashok',
    invoice:'INV 101',
    date:'12-12-2012',
    amount:10000,
    note:'Note some this',
    // photo: require('../assets/images/sample.png')

  },
]

const PurchasesList = () => {
     const colorScheme = useColorScheme();

    const navigation = useNavigation();
      useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View className="me-4 bg-dark">
              <TouchableOpacity
                onPress={() => router.push("/purchases/create-purchase")}
                className="flex flex-row justify-center items-center gap-2"
              >
                <Ionicons name="person-add" size={18} color="#ffffff" />
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
    <FlatList
    data={data}                           // 
    keyExtractor={(_, index) => index.toString()}    // 
    renderItem={({ item }) => (
      <TouchableOpacity
      className=""
      activeOpacity={0.6} // lower = more fade
      onPress={() => console.log('Clicked item:',)}
    >

      <View className="flex-row justify-between p-4 bg-black-200 rounded-lg ms-4 me-4 mt-4 items-center">
        <View className="flex-col">
        <View className="flex-row items-center">
        
            <View>
              <Text className="text-primary text-lg ">{item.name}</Text>
              <Text className="text-gray-200 text-sm"> Invoice: {item.invoice}</Text>
            </View>
        </View>
        </View>
        
        <View className="flex-col items-end">

        <Text className="text-gray-200">{item.date}</Text>
          <Text className="text-primary ">{item.amount} <Text className="text-gray-200">BDT</Text></Text>
        </View>
      </View>
      </TouchableOpacity>
    )}
  />
  </>
  );
};

export default PurchasesList;