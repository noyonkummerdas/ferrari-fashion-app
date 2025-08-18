import { router, Tabs } from "expo-router";
import React from "react";

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { CustomDrawerToggleButton } from "../../../components";
const profile = require("../../../assets/images/profile.jpg");

//@ts-ignore
const TabIcon = ({ icon, iconAlt, name, color, focused }) => {
  return (
    <>
      <View className={`flex items-center justify-center`}>
        <View
          className={` items-center justify-center ${focused && " justify-center"} `}
        >
          <View
            className={`flex items-center justify-center ${focused && "w-16"} `}
          >
            <Ionicons
              //@ts-ignore
              name={`${focused ? icon : iconAlt}`}
              // size={ 24}
              size={focused ? 30 : 28}
              color={color}
            />
            {focused && (
              <Text className="text-gray-300 font-pregular text-xs">
                {name}
              </Text>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FDB714", // Primary color for active tabs
        tabBarInactiveTintColor: "#9CA3AF", // Gray-200 for inactive tabs
        tabBarStyle: {
          backgroundColor: "#1F2937", // Dark background color
          borderTopColor: "#1F2937",
          borderTopWidth: 1,
          height: 64,
          overflow: "hidden",
          width: "auto",
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "FerrariFashion",
          headerTitleAlign: "center",
          headerTitle: () => (
            <View className="h-8 w-auto">
              {/* <Image
                        source={logo_h}
                        className=" w-auto" // Adjust logo size here
                      /> */}
              <Text className=" font-pbold text-primary">FerrariFashion</Text>
            </View>
          ),
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="storefront-sharp"
              iconAlt="storefront-outline"
              color={color}
              name="store"
              focused={focused}
            />
          ),
          headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/settings/profile" })}
              className="mx-2 pe-3"
            >
              <Image source={profile} className="h-8 w-8 ms-4 rounded-full" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="(stock)"
        options={{
          title: "Stock",
          headerShown: false, // Let the stack handle the header
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="archive"
              iconAlt="archive-outline"
              color={color}
              name="stock"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000000" },
          headerTitle: () => (
            <View>
              <Text className="font-pbold text-white text-center text-xl">
                Accounts
              </Text>
            </View>
          ),
          headerShown: false,
          headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
          headerRight: () => (
            <View className="mx-2 pe-3">
              <Image source={profile} className="h-8 w-8 ms-4 rounded-full" />
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="calculator"
              iconAlt="calculator-outline"
              color={color}
              name="Account"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(connects)"
        options={{
          title: "People",
          headerTitleAlign: "left",
          headerShown: false,

          headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon="people"
              iconAlt="people-outline"
              color={color}
              name="People"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
