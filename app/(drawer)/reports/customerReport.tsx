import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';





const data =[
    {
        name:'niloy howlader',
        age:22
    }
]
const customerReport = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
          title: `${data?.name || "Customer Report"}`,
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
      }, [navigation, data]);
  return (
    <View>
      <Text className='text-gray-200'>customerReport</Text>
    </View>
  )
}

export default customerReport

const styles = StyleSheet.create({})