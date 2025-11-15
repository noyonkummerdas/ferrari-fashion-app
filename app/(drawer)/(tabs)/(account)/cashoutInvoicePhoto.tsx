import profile from '@/assets/images/Invoice.jpg';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useLayoutEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

const cashoutInvoicePhoto = () => {
    const navigation = useNavigation();
      const { invoice, photo } = useLocalSearchParams();
    const { userInfo } = useGlobalContext();
    const [currentDay, setCurrentDay] = useState(new Date());

    // console.log("CASHOUT INVOICE PARAMS", invoice, photo);

      useLayoutEffect(() => {
        navigation.setOptions({
          title: "Invoice Photo",
          //@ts-ignore
          headerStyle: {
            backgroundColor: `#000000`,
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
        });
      }, [navigation]);
  return (
    <View>
      <StatusBar style="light" backgroundColor="#000" />
      <Image source={photo ? { uri: photo } : profile} className="w-[360px] h-[650px] m-3" />
    </View>
  )
}

export default cashoutInvoicePhoto