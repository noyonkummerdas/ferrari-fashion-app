import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";

const Warehouse = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      // <View className='me-4' >
      //     <TouchableOpacity onPress={()=>setIsPhoto(!isPhoto)} className='flex flex-row justify-center items-center gap-2'>
      //       <Ionicons name={isPhoto ? "image-sharp" : "image-outline"} size={24}  color="#f2652d" />
      //       <Text className='text-primary text-xl font-pmedium'>Photo</Text>
      //     </TouchableOpacity>
      // </View>
      // ),
      title: "Report",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "left",
      headerShown: true,
    });
  }, [navigation]);

  return (
    <View>
      <Text className="text-white">Report</Text>
    </View>
  );
};

export default Warehouse;
