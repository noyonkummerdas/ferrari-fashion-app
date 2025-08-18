import { Stack } from "expo-router";
import React from "react";
import { CustomDrawerToggleButton } from "../../../../components";

export default function AccountLayout() {
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
        name="index"
        options={{
          title: "Accounts",
          headerShown: true,
          headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
        }}
      />
      <Stack.Screen
        name="cashDeposit"
        options={{
          title: "Cash Deposit",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="cashOut"
        options={{
          title: "Cash Out",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="received-payment"
        options={{
          title: "Received Payment",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
