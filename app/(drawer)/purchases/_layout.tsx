import { Stack } from "expo-router";

export default function SalesLayout() {
  return (
    
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: "#000000",
      },
      headerTintColor: "#ffffff",
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
          title: "Purchases List",
            
        }}
      />

      {/* Create Sale */}
      <Stack.Screen
        name="create"
        options={{
          title: "Create Purchases",
        }}
      />

      {/* Sale Details */}
      <Stack.Screen
        name="[id]"
        options={{
          title: "Purchases Details",
        }}
      />
    </Stack>
  );
}
