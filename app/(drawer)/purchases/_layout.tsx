import { Stack } from "expo-router";

export default function SalesLayout() {
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
      {/* Sales List */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // তোমার custom header কাজ করবে
        }}
      />

      {/* Create Sale */}
      <Stack.Screen
        name="create"
        options={{
          headerShown: false, // এখানেও চাইলে custom বানাতে পারো
        }}
      />

      {/* Sale Details */}
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false, // এখানেও custom রাখো
        }}
      />
    </Stack>
  );
}
