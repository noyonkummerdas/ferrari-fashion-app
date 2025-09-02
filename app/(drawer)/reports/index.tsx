import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
// import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useMemo, useState, useCallback } from "react";
import {  View, Text, TouchableOpacity, Modal, Platform, FlatList, RefreshControl, ScrollView } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns";


const CustomDrawerToggleButton = ({ tintColor = "#FDB714" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="menu" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};




// ===== Replace these with your RTK Query hooks later =====
// import { useReportSummaryQuery, useReportTransactionsQuery } from "@/store/api/reportApi";
// import { useGlobalContext } from "@/context/GlobalProvider";

// Dummy transactions to simulate API response
const MOCK_TX = [
  { id: "tx1", date: "2025-08-29", module: "Sales", ref: "S-1001", amount: 290000, status: "paid" },
  { id: "tx2", date: "2025-08-30", module: "Purchases", ref: "P-2042", amount: 120000, status: "due" },
  { id: "tx3", date: "2025-08-31", module: "Accounts", ref: "RCV-311", amount: 50000, status: "received" },
  { id: "tx4", date: "2025-08-31", module: "Sales", ref: "S-1002", amount: 175000, status: "partial" },
  { id: "tx5", date: "2025-08-28", module: "Supplier", ref: "SUP-999", amount: 220000, status: "paid" },
  { id: "tx6", date: "2025-08-31", module: "Warehouse", ref: "STK-33", amount: 0, status: "moved" },
  { id: "tx7", date: "2025-08-31", module: "Customer", ref: "CUST-19", amount: 0, status: "updated" },
  { id: "tx7", date: "2025-08-31", module: "Stock", ref: "CUST-19", amount: 0, status: "updated" },
];

const MODULES = [
  "All",
  "Supplier",
  "Customer",
  "Warehouse",
  "Sales",
  "Purchases",
  "Accounts",
  "Users",
  "Stock",
] as const;

const Report = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

    // const { userInfo } = useGlobalContext();
    const [fromDate, setFromDate] = useState<Date>(startOfDay(new Date()));
    const [toDate, setToDate] = useState<Date>(endOfDay(new Date()));
    const [showPicker, setShowPicker] = useState<{ which: "from" | "to" | null }>({ which: null });
    const [module, setModule] = useState<(typeof MODULES)[number]>("All");
    const [refreshing, setRefreshing] = useState(false);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
      <View className='me-4 flex flex-row justify-center items-center gap-2' >
          <TouchableOpacity onPress={()=>console.log("download")} className='flex flex-row justify-center items-center gap-2'>
            <Ionicons name="download-outline" size={24} color="#ffffff" />

            {/* <Text className='text-primary text-xl font-pmedium'>Photo</Text> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>console.log("print")} className='flex flex-row justify-center items-center gap-2'>
            <Ionicons name="print-outline" size={24} color="#ffffff" />
          
          </TouchableOpacity>
      </View>
      ),
      title: "Report",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
       headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);

 


  // ===== When hooking to API, pass these as params =====
  // const { data: summary } = useReportSummaryQuery({ from: fromDate, to: toDate, module, warehouse: userInfo?.warehouse });
  // const { data: list } = useReportTransactionsQuery({ from: fromDate, to: toDate, module, warehouse: userInfo?.warehouse });

  const list = useMemo(() => {
    const interval = { start: startOfDay(fromDate), end: endOfDay(toDate) };
    return MOCK_TX.filter((t) => {
      const inRange = isWithinInterval(new Date(t.date), interval) || isSameDay(new Date(t.date), fromDate) || isSameDay(new Date(t.date), toDate);
      const byModule = module === "All" ? true : t.module === module;
      return inRange && byModule;
    });
  }, [fromDate, toDate, module]);

  const totals = useMemo(() => {
    const stock =list.filter((x)=>x.module === 'stock').reduce((s, x) => s + x.amount, 0)
    const sales =list.filter((x)=>x.module === 'sales').reduce((s, x) => s + x.amount, 0)
    const purchases = list.filter((x) => x.module === "Purchases").reduce((s, x) => s + x.amount, 0);
    const paymentsReceived = list.filter((x) => x.module === "Accounts" && x.status === "received").reduce((s, x) => s + x.amount, 0);
    const balance = sales - purchases; // simplify for prototype
    const customer = list.filter((x) => x.module === "Customer").reduce((s, x) => s + x.amount, 0);
    const supplier = list.filter((x) => x.module === "Supplier").reduce((s, x) => s + x.amount, 0);
      return { sales, purchases, paymentsReceived, balance, stock, customer, supplier  };
  }, [list]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // await refetch() when wired to API
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const openPicker = (which: "from" | "to") => setShowPicker({ which });
  const closePicker = () => setShowPicker({ which: null });
  const onChangeDate = (_: any, selected?: Date) => {
    if (Platform.OS === "android") closePicker();
    if (!selected) return;
    if (showPicker.which === "from") setFromDate(startOfDay(selected));
    if (showPicker.which === "to") setToDate(endOfDay(selected));
  };

  return (
    <ScrollView>
    <View className="flex-1 bg-zinc-900">
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">Reporting Date</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => openPicker("from")} className="px-3 py-2 rounded-xl bg-zinc-800">
            <Text className="text-white">From: {format(fromDate, "dd MMM")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPicker("to")} className="px-3 py-2 rounded-xl bg-zinc-800">
            <Text className="text-white">To: {format(toDate, "dd MMM")}</Text>
          </TouchableOpacity>
          <Ionicons name="calendar-outline" size={22} color="#fdb714" />
        </View>
      </View>

      {/* Module Filter */}
      {/* <View className="px-4">
        <FlatList
          data={MODULES as unknown as string[]}
          keyExtractor={(m) => m}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 6 }}
          renderItem={({ item }) => {
            const active = item === module;
            return (
              <TouchableOpacity onPress={() => setModule(item as any)} className={`px-4 py-2 mr-2 rounded-full ${active ? "bg-yellow-400" : "bg-zinc-800"}`}>
                <Text className={`text-sm ${active ? "text-black" : "text-white"}`}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View> */}
       {/* Stock */}
       <View className="px-4 mt-2 flex  flex-wrap gap-2">
        <View className="flex flex-col justify-center items-start bg-black-200 rounded-2xl p-4">
          <Text className="text-white text-lg font-lg">Stock Status By Warehouse</Text>
        </View>
       {/* Stock In and Stock Out */}
        <View className="flex flex-row justify-between">
        <View className="p-2 w-1/2 ">
        <SummaryCard  label="Stock In" value={totals.stock} suffix="BDT" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Stock Out" value={totals.balance} suffix="BDT" className="gap-2" />
        </View>
        </View>


        {/* Total Quantity and Total Amount */}
       <View className="flex flex-row justify-between">
       <View className="p-2 w-1/2 ">
        <SummaryCard label="Total Quantity" value={totals.customer} suffix="BDT" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Total Amount" value={totals.supplier} suffix="BDT" className="gap-2" />
        </View>
       </View>
      </View>
       {/* Customers */}
       <View className="px-4 mt-2 flex  flex-wrap gap-2">
        <View className="flex flex-row justify-between  items-cneter bg-black-200 rounded-2xl p-4">
          <Text className="text-white text-lg font-lg">Top Customers</Text>
          <Ionicons name="chevron-down" size={24} color="#ffffff" />
        </View>
       {/* Total Customers and Due Sales */}
        <View className="flex flex-row justify-between">
        <View className="p-2 w-1/2 ">
        <SummaryCard  label="Total Customers" value={totals.stock} suffix="Person" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Due Sales" value={totals.balance} suffix="Count" className="gap-2" />
     
        </View>
        </View>


        {/* Recevied Payment and Total Amount */}
       <View className="flex flex-row justify-between">
       <View className="p-2 w-1/2 ">
        <SummaryCard label="Recevied Payment" value={totals.customer} suffix="BDT" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Total Sales" value={totals.supplier} suffix="BDT" className="gap-2" />
        </View>
       </View>
      </View>
       <View className="px-4 mt-2 flex  flex-wrap gap-2">
        <View className="flex flex-row justify-between  items-cneter bg-black-200 rounded-2xl p-4">
          <Text className="text-white text-lg font-lg">Top Suppliers</Text>
          <Ionicons name="chevron-down" size={24} color="#ffffff" />
        </View>
       {/* Total Customers and Due Sales */}
        <View className="flex flex-row justify-between">
        <View className="p-2 w-1/2 ">
        <SummaryCard  label="Total Supplire" value={totals.stock} suffix="Person" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Purchases" value={totals.purchases} suffix="BDT" className="gap-2" />
     
        </View>
        </View>


        {/* Recevied Payment and Total Amount */}
       <View className="flex flex-row justify-between">
       <View className="p-2 w-1/2 ">
        <SummaryCard label="Payment" value={totals.customer} suffix="BDT" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Total Amount" value={totals.supplier} suffix="BDT" className="gap-2" />
        </View>
       </View>
      </View>


      {/* Summary Cards */}

      <View className="px-4 mt-2 flex  flex-wrap gap-2">
        {/* <View className="flex flex-col justify-center items-start bg-black-200 rounded-2xl p-4">
          <Text className="text-white text-lg font-lg">Sales</Text>
        </View> */}
       {/* Sales */}
        {/* <View className="flex flex-row justify-between">
        <View className="p-2 w-1/2 ">
        <SummaryCard  label="Sales" value={totals.sales} suffix="BDT" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Purchases" value={totals.purchases} suffix="BDT" className="gap-2" />
        </View>
        </View> */}


        {/* Payments Received */}
       {/* <View className="flex flex-row justify-between">
       <View className="p-2 w-1/2 ">
        <SummaryCard label="Payments Received" value={totals.paymentsReceived} suffix="BDT" className="gap-2" />
        </View>
        <View className="p-2 w-1/2 ">
        <SummaryCard label="Balance" value={totals.balance} suffix="BDT" className="gap-2" />
        </View>
       </View> */}
      </View>

     
      {/* List Header */}
      <View className="px-4 mt-4">
        <Text className="text-white/80 mb-2 font-pbold">Transactions ({list.length})</Text>
      </View>

      {/* Transactions List */}
      {/* <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={<Text className="text-center text-zinc-400 mt-10">No data for selected filters</Text>}
        renderItem={({ item }) => (
          <View className="bg-zinc-800 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-white text-base font-medium">{item.module}</Text>
              <Text className="text-yellow-400">{format(new Date(item.date), "dd MMM yyyy")}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-zinc-300">Ref: {item.ref}</Text>
              <Text className="text-yellow-400 font-semibold">{item.amount.toLocaleString()} BDT</Text>
            </View>
            <Text className="text-xs text-zinc-400 mt-1">Status: {item.status}</Text>
          </View>
        )}
      /> */}

      {/* Date Pickers */}
      <Modal visible={!!showPicker.which} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-zinc-900 rounded-2xl p-4 w-11/12">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-lg font-semibold">Select Date</Text>
              <TouchableOpacity onPress={closePicker}>
                <Ionicons name="close" size={22} color="#aaa" />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={showPicker.which === "from" ? fromDate : toDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
            {Platform.OS === "ios" && (
              <View className="flex-row justify-end mt-3">
                <TouchableOpacity onPress={closePicker} className="px-4 py-2 bg-yellow-400 rounded-xl">
                  <Text className="text-black font-semibold">Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
}

function SummaryCard({ label, value, suffix, className }: { label: string; value: number; suffix?: string; className ?: string }) {
  return (
    <View className="bg-zinc-800 rounded-2xl p-4">
      <Text className="text-zinc-300 text-sm mb-1">{label}</Text>
      <Text className="text-yellow-400 text-xl font-bold">{value.toLocaleString()} {suffix ?? ""}</Text>
    </View>
  );
}


//   return (
//     <View>
//       <Text className="text-white">Report</Text>
//     </View>
//   );
// };

export default Report;
