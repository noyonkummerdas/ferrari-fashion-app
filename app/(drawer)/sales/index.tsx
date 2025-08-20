import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { useColorScheme } from "react-native";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
const SalesList = () => {
     const colorScheme = useColorScheme();

    const navigation = useNavigation();
      useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View className="me-4 bg-dark">
              <TouchableOpacity
                onPress={() => router.push("/Sales/createDueSales")}
                className="flex flex-row justify-center items-center gap-2"
              >
                <Ionicons name="person-add" size={18} color="#ffffff" />
                <Text className="text-white text-xl font-pmedium">Add</Text>
              </TouchableOpacity>
            </View>
          ),
          title: "Due Sales",
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
    <View>
      <Text className="text-gray-200">Sales list </Text>
    </View>
  );
};

export default SalesList;