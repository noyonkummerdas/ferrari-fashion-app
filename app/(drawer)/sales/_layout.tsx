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
          title: "Sales List",
            
        }}
      />

      {/* Create Sale */}
      <Stack.Screen
        name="create"
        options={{
          title: "Create Sales",
        }}
      />

      {/* Sale Details */}
      <Stack.Screen
        name="[id]"
        options={{
          title: "Sales Details",
        }}
      />
    </Stack>
  );
}
