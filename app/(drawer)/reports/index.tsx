import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
// import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, {
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import {
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { router } from "expo-router";

// ===== Dummy User Context =====
const useGlobalContext = () => {
  return { userInfo: { warehouse: "Main" } };
};

// ===== Dummy transactions to simulate API response =====
const MOCK_TX = [
  {
    id: "tx1",
    date: "2025-08-29",
    module: "Sales",
    ref: "S-1001",
    amount: 290000,
    status: "paid",
  },
  {
    id: "tx2",
    date: "2025-08-30",
    module: "Purchases",
    ref: "P-2042",
    amount: 120000,
    status: "due",
  },
  {
    id: "tx3",
    date: "2025-08-31",
    module: "Accounts",
    ref: "RCV-311",
    amount: 50000,
    status: "received",
  },
  {
    id: "tx4",
    date: "2025-08-31",
    module: "Sales",
    ref: "S-1002",
    amount: 175000,
    status: "partial",
  },
  {
    id: "tx5",
    date: "2025-08-28",
    module: "Supplier",
    ref: "SUP-999",
    amount: 220000,
    status: "paid",
  },
  {
    id: "tx6",
    date: "2025-08-31",
    module: "Warehouse",
    ref: "STK-33",
    amount: 0,
    status: "moved",
  },
  {
    id: "tx7",
    date: "2025-08-31",
    module: "Customer",
    ref: "CUST-19",
    amount: 0,
    status: "updated",
  },
  {
    id: "tx8",
    date: "2025-08-31",
    module: "Stock",
    ref: "CUST-19",
    amount: 0,
    status: "updated",
  },
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

const Report = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  const [fromDate, setFromDate] = useState<Date>(startOfDay(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfDay(new Date()));
  const [showPicker, setShowPicker] = useState<{
    which: "from" | "to" | null;
  }>({ which: null });
  const [module, setModule] =
    useState<(typeof MODULES)[number]>("All");
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="me-4 flex flex-row justify-center items-center gap-2">
          <TouchableOpacity
            onPress={() => console.log("download")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="download-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("print")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="print-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Report",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      headerLeft: () => (
        <CustomDrawerToggleButton tintColor="#ffffff" />
      ),
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#ffffff",
      },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);

  // ===== Mock data instead of API =====
  const list = useMemo(() => {
    const interval = { start: startOfDay(fromDate), end: endOfDay(toDate) };
    return MOCK_TX.filter((t) => {
      const inRange =
        isWithinInterval(new Date(t.date), interval) ||
        isSameDay(new Date(t.date), fromDate) ||
        isSameDay(new Date(t.date), toDate);
      const byModule = module === "All" ? true : t.module === module;
      return inRange && byModule;
    });
  }, [fromDate, toDate, module]);

  const totals = useMemo(() => {
    const stock = list
      .filter((x) => x.module.toLowerCase() === "stock")
      .reduce((s, x) => s + x.amount, 0);
    const sales = list
      .filter((x) => x.module.toLowerCase() === "sales")
      .reduce((s, x) => s + x.amount, 0);
    const purchases = list
      .filter((x) => x.module === "Purchases")
      .reduce((s, x) => s + x.amount, 0);
    const paymentsReceived = list
      .filter((x) => x.module === "Accounts" && x.status === "received")
      .reduce((s, x) => s + x.amount, 0);
    const balance = sales - purchases;
    const customer = list
      .filter((x) => x.module === "Customer")
      .reduce((s, x) => s + x.amount, 0);
    const supplier = list
      .filter((x) => x.module === "Supplier")
      .reduce((s, x) => s + x.amount, 0);
    return {
      sales,
      purchases,
      paymentsReceived,
      balance,
      stock,
      customer,
      supplier,
    };
  }, [list]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  
  const closePicker = () => setShowPicker({ which: null });
  const onChangeDate = (_: any, selected?: Date) => {
    if (Platform.OS === "android") closePicker();
    if (!selected) return;
    if (showPicker.which === "from") setFromDate(startOfDay(selected));
    if (showPicker.which === "to") setToDate(endOfDay(selected));
  };

  // return (
  //   <ScrollView className="flex-1 bg-zinc-900">
  //     {/* Header */}
  //     <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
  //       <Text className="text-white text-xl font-semibold">
  //         Reporting Date
  //       </Text>
  //       <View className="flex-row items-center gap-3">
  //         <TouchableOpacity
  //           onPress={() => openPicker("from")}
  //           className="px-3 py-2 rounded-xl bg-zinc-800"
  //         >
  //           <Text className="text-white">
  //             From: {format(fromDate, "dd MMM")}
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => openPicker("to")}
  //           className="px-3 py-2 rounded-xl bg-zinc-800"
  //         >
  //           <Text className="text-white">
  //             To: {format(toDate, "dd MMM")}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>

  //     {/* Module Filter */}
  //     <View className="px-4">
  //       <FlatList
  //         data={MODULES as unknown as string[]}
  //         keyExtractor={(m) => m}
  //         horizontal
  //         showsHorizontalScrollIndicator={false}
  //         contentContainerStyle={{ paddingVertical: 6 }}
  //         renderItem={({ item }) => {
  //           const active = item === module;
  //           return (
  //             <TouchableOpacity
  //               onPress={() => setModule(item as any)}
  //               className={`px-4 py-2 mr-2 rounded-full ${
  //                 active ? "bg-yellow-400" : "bg-zinc-800"
  //               }`}
  //             >
  //               <Text
  //                 className={`text-sm ${
  //                   active ? "text-black" : "text-white"
  //                 }`}
  //               >
  //                 {item}
  //               </Text>
  //             </TouchableOpacity>
  //           );
  //         }}
  //       />
  //     </View>

  //     {/* Example Summary */}
  //     <View className="px-4 mt-2">
  //       <SummaryCard
  //         label="Total Sales"
  //         value={totals.sales}
  //         suffix="BDT"
  //       />
  //       <SummaryCard
  //         label="Purchases"
  //         value={totals.purchases}
  //         suffix="BDT"
  //       />
  //       <SummaryCard
  //         label="Payments Received"
  //         value={totals.paymentsReceived}
  //         suffix="BDT"
  //       />
  //       <SummaryCard
  //         label="Balance"
  //         value={totals.balance}
  //         suffix="BDT"
  //       />
  //     </View>

  //     {/* Transactions List */}
  //     <View className="px-4 mt-4">
  //       <Text className="text-white/80 mb-2 font-bold">
  //         Transactions ({list.length})
  //       </Text>
  //     </View>

  //     <FlatList
  //       data={list}
  //       keyExtractor={(item) => item.id}
  //       refreshControl={
  //         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  //       }
  //       contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
  //       ListEmptyComponent={
  //         <Text className="text-center text-zinc-400 mt-10">
  //           No data for selected filters
  //         </Text>
  //       }
  //       renderItem={({ item }) => (
  //         <View className="bg-zinc-800 rounded-2xl p-4 mb-3">
  //           <View className="flex-row justify-between items-center mb-1">
  //             <Text className="text-white text-base font-medium">
  //               {item.module}
  //             </Text>
  //             <Text className="text-yellow-400">
  //               {format(new Date(item.date), "dd MMM yyyy")}
  //             </Text>
  //           </View>
  //           <View className="flex-row justify-between items-center">
  //             <Text className="text-zinc-300">Ref: {item.ref}</Text>
  //             <Text className="text-yellow-400 font-semibold">
  //               {item.amount.toLocaleString()} BDT
  //             </Text>
  //           </View>
  //           <Text className="text-xs text-zinc-400 mt-1">
  //             Status: {item.status}
  //           </Text>
  //         </View>
  //       )}
  //     />

  //     {/* Date Picker Modal */}
  //     <Modal visible={!!showPicker.which} transparent animationType="fade">
  //       <View className="flex-1 bg-black/60 items-center justify-center">
  //         <View className="bg-zinc-900 rounded-2xl p-4 w-11/12">
  //           <View className="flex-row justify-between items-center mb-3">
  //             <Text className="text-white text-lg font-semibold">
  //               Select Date
  //             </Text>
  //             <TouchableOpacity onPress={closePicker}>
  //               <Ionicons name="close" size={22} color="#aaa" />
  //             </TouchableOpacity>
  //           </View>
  //           <DateTimePicker
  //             value={showPicker.which === "from" ? fromDate : toDate}
  //             mode="date"
  //             display={Platform.OS === "ios" ? "spinner" : "default"}
  //             onChange={onChangeDate}
  //             maximumDate={new Date()}
  //           />
  //           {Platform.OS === "ios" && (
  //             <View className="flex-row justify-end mt-3">
  //               <TouchableOpacity
  //                 onPress={closePicker}
  //                 className="px-4 py-2 bg-yellow-400 rounded-xl"
  //               >
  //                 <Text className="text-black font-semibold">Done</Text>
  //               </TouchableOpacity>
  //             </View>
  //           )}
  //         </View>
  //       </View>
  //     </Modal>
  //   </ScrollView>
  // );

  return (
     <ScrollView className="flex-1 bg-dark p-2">
    {/**stock */}
    <View className="" >
      {/* <View>
        <Text className="text-gray-200 text-2xl ms-2">Repoting Dashbord</Text>
      </View> */}
      <TouchableOpacity 
      onPress={()=>router.push('/(drawer)/reports/salesReport')}
      className="bg-black-200 p-4 rounded-lg mt-4 flex-row items-center justify-between border-2 border-golden-600  ">


       <View className=" flex-row items-center">
         <Ionicons name="cart" size={40} color="#fdb714" />
       <View className="flex-col ms-2">
       
       <Text className="text-gray-200 text-2xl ms-2 font-pbold">Sales</Text>
       <Text className="text-gray-200 text-lg ms-2">Report</Text>
       </View>
       {/* <Ionicons className="bg-primary p-2 rounded-full text-center w-[100px]" name="return-down-forward" size={24} color="#fff" />        */}
       </View>
     
      </TouchableOpacity>
    </View>
    {/**Product */}
    <View className="">
      <TouchableOpacity 
      onPress={()=>router.push('/(drawer)/reports/productReport')}
      className="bg-black-200 p-4 rounded-lg mt-4 flex-row items-center justify-between">
        <View className="flex-col">
        
        <Text className="text-gray-200 text-2xl  font-pbold ms-2">Products</Text>
        <Text className="text-gray-200 text-lg ms-2">Report</Text>
        <Ionicons className="bg-primary p-2 flex text-center w-[100px] rounded-full" name="return-down-forward" size={30} color="#fff" />     
        </View>
        <Ionicons name="cube" size={50} color="#fdb714" />
       
      </TouchableOpacity>
    </View>
    {/**Customer */}
    <View className="">
      <TouchableOpacity 
      onPress={()=>router.push('/(drawer)/reports/customerReport')}
      className="bg-black-200 p-4 rounded-lg mt-4 flex-row items-center justify-between">
       <View className="flex-col">
       
       <Text className="text-gray-200 text-2xl ms-2 font-pbold">Custoemr  </Text>
       <Text className="text-gray-200 text-lg ms-2">Report  </Text>
       <Ionicons className="bg-primary p-2 flex text-center w-[100px] rounded-full" name="return-down-forward" size={30} color="#fff" />  
       </View>
       <Ionicons name="person" size={50} color="#fdb714" />
      </TouchableOpacity>
    </View>
    {/**Supplire */}
    <View className="">
      <TouchableOpacity 
      onPress={()=>router.push('/(drawer)/reports/supplireReport')}
      className="bg-black-200 p-4 rounded-lg mt-4 flex-row items-center justify-between">
        <View className="flex-col">
       
        <Text className="text-gray-200 text-2xl  font-pbold ms-2">Supplire</Text>
        <Text className="text-gray-200 text-lg ms-2">Report</Text>
        <Ionicons className="bg-primary p-2 flex text-center w-[100px] rounded-full" name="return-down-forward" size={30} color="#fff" /> 
        </View>
        <Ionicons name="people" size={50} color="#fdb714" />
      </TouchableOpacity>
    </View>
    {/**Account*/}
    <View className="">
      <TouchableOpacity 
      onPress={()=>router.push('/(drawer)/reports/accountsReport')}
      className="bg-black-200 p-4 rounded-lg mt-4 flex-row items-center justify-between">
        <View className="flex-col ">
       
        <Text className="text-gray-200 text-2xl ms-2 font-pbold">Accounts</Text>
        <Text className="text-gray-200 text-lg ms-2">Report</Text>
        <Ionicons className="bg-primary p-2 flex text-center w-[100px] rounded-full" name="return-down-forward" size={30} color="#fff" /> 
        </View>
        <Ionicons name="wallet" size={50} color="#fdb714" />   
        </TouchableOpacity>
    </View>
  </ScrollView>
  )
};

function SummaryCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <View className="bg-zinc-800 rounded-2xl p-4 mb-3">
      <Text className="text-zinc-300 text-sm mb-1">{label}</Text>
      <Text className="text-yellow-400 text-xl font-bold">
        {value.toLocaleString()} {suffix ?? ""}
      </Text>
    </View>
  );
}

export default Report;
