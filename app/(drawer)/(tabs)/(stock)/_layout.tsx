import { Stack } from "expo-router";
import React from "react";
import { CustomDrawerToggleButton } from "../../../../components";

export default function StockLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#FDB714",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#ffffff",
        },
      }}
    >
      <Stack.Screen
        name="stocks"
        options={{
          title: "Stock Management",
          headerShown: true,
          headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Stock Details",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-stock"
        options={{
          title: "Add Stock",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="update/[id]"
        options={{
          title: "Update Stock",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
