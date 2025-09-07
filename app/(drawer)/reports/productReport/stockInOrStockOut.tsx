import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useLayoutEffect } from 'react'
import { router, useNavigation } from 'expo-router';

const stockInOrStockOut = () => {
    const colorScheme = useColorScheme();
        const navigation = useNavigation();
        useLayoutEffect(() => {
            navigation.setOptions({
              title:"Stock In & Out Report",
              //@ts-ignore
              headerStyle: {
                backgroundColor: `#000000`, //`${Colors[colorScheme ?? "dark"].backgroundColor}`,
              },
              //@ts-ignore
              headerTintColor: `#ffffff`,
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
              headerShadowVisible: false,
              headerTitleAlign: "center",
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ),
            //   headerRight: () => (
            //     <TouchableOpacity
            //       onPress={() => router.push(`/customer/${id}`)}
            //       className="flex flex-row items-center gap-2"
            //     >
            //       <Ionicons name="pencil-outline" size={24} color="white" />
            //       <Text className="text-white text-lg">Edit</Text>
            //     </TouchableOpacity>
            //   ),
            });
          }, [navigation,]); 
  return (
    <View>
      <Text className='text-gray-200'>stockInOrStockOut</Text>
    </View>
  )
}

export default stockInOrStockOut

const styles = StyleSheet.create({})