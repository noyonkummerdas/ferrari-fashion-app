import { Stack } from "expo-router";

export default function ReportsLayout() {
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
        headerTitleAlign: "center",
      }}
    >
      {/* Report List */}
      <Stack.Screen
        name="index"
        options={{
          title: "Reports List",
        }}
      />

      {/* Sales Report */}
      <Stack.Screen
        name="SalesReport"
        options={{
          title: "Sales Report",
        }}
      />

      {/* Product Report */}
      <Stack.Screen
        name="ProductReport"
        options={{
          title: "Product Report",
        }}
      />

      {/* Customer Report */}
      <Stack.Screen
        name="CustomerReport"
        options={{
          title: "Customer Report",
        }}
      />

      {/* Supplier Report */}
      <Stack.Screen
        name="SupplierReport"
        options={{
          title: "Supplier Report",
        }}
      />

      {/* Account Report */}
      <Stack.Screen
        name="AccountReport"
        options={{
          title: "Account Report",
        }}
      />

      {/* New Accounts Screens */}

      {/* Cash In Report */}
      <Stack.Screen
        name="cashIn"
        options={{
          title: "Cash In",
        }}
      />

      {/* Cash Out Report */}
      <Stack.Screen
        name="cashOut"
        options={{
          title: "Cash Out",
        }}
      />

      {/* Payment Report */}
      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
        }}
      />

      {/* Payment Received Report */}
      <Stack.Screen
        name="paymentReceived"
        options={{
          title: "Payment Received",
        }}
      />
    </Stack>
  );
}
