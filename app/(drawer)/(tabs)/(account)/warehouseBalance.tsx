// import { useGlobalContext } from "@/context/GlobalProvider";
// import { useTransactionListQuery } from "@/store/api/transactionApi";
// import { useWarehousesQuery } from "@/store/api/warehouseApi";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { addDays, format, isToday, subDays } from "date-fns";
// import { Link, useNavigation } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Modal,
//   Platform,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from "react-native";

// const WarehouserBalance = () => {
//   const colorScheme = useColorScheme();
//   const navigation = useNavigation();
//   const { userInfo } = useGlobalContext();

//   const [id, setId] = useState("all");
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [currentDay, setCurrentDay] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [tempDate, setTempDate] = useState(new Date());

//   // 3 day range 
//   const startDate = format(subDays(currentDay, 29), "MM-dd-yyyy");
//   const endDate = format(currentDay, "MM-dd-yyyy");

//   // Set warehouse id for user/admin
//   useEffect(() => {
//     if (userInfo?.type === "admin") setId("all");
//     else setId(userInfo?.warehouse);
//   }, [userInfo]);

//   // Fetch deposits
//   const { data: depositData, isLoading: depositLoading, refetch: refetchDeposit } =
//     useTransactionListQuery({
//       warehouse: userInfo?.warehouse,
//       type: "deposit",
//       date: format(currentDay, "MM-dd-yyyy"),
//       startDate,
//       endDate,
//       forceRefetch: true,
//     });

//   // Fetch cashouts
//   const { data: cashoutData, isLoading: cashoutLoading, refetch: refetchCashout } =
//     useTransactionListQuery({
//       warehouse: userInfo?.warehouse,
//       type: "cashOut",
//       date: format(currentDay, "MM-dd-yyyy"),
//       startDate,
//       endDate,
//       forceRefetch: true,
//     });
//     console.log('cashoutData', cashoutData);

//   const { data: warehouseData } = useWarehousesQuery();

//   // Refresh on date/id change
//   useEffect(() => {
//     refetchDeposit();
//     refetchCashout();
//   }, [id, currentDay]);

//   useEffect(() => {
//     // Combine deposits and cashouts
//     const deposits = Array.isArray(depositData?.transactions) ? depositData.transactions : [];
//     const cashouts = Array.isArray(cashoutData?.transactions) ? cashoutData.transactions : [];
//     const combined = [
//       ...deposits.map((t) => ({
//         date: format(new Date(t.date), "dd MMM yyyy"),
//         entryBy: t.name || "-",
//         category: t.note || "-",
//         mode: "Cash",
//         cashIn: t.amount,
//         cashOut: null,
//       })),
//       ...cashouts.map((t) => ({
//         date: format(new Date(t.date), "dd MMM yyyy"),
//         entryBy: t.name || "-",
//         category: t.note || "-",
//         mode: "Cash",
//         cashIn: null,
//         cashOut: t.amount,
//       })),
//     ]
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     // Calculate running balance
//     let balance = 0;
//     const withBalance = combined.map((t) => {
//       balance += (t.cashIn || 0) - (t.cashOut || 0);
//       return { ...t, balance };
//     });

//     setTransactions(withBalance);
//   }, [depositData, cashoutData]);

//   const formattedDate = {
//     day: currentDay.getDate(),
//     month: currentDay.toLocaleString("en-US", { month: "long" }),
//     year: currentDay.getFullYear(),
//   };

//   const goToPreviousDay = () => setCurrentDay((prev) => subDays(prev, 1));
//   const goToNextDay = () => {
//     if (!isToday(currentDay)) setCurrentDay((prev) => addDays(prev, 1));
//   };

//   const openDatePicker = () => {
//     setTempDate(currentDay);
//     setShowDatePicker(true);
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     if (Platform.OS === "android") setShowDatePicker(false);
//     if (selectedDate) setTempDate(selectedDate);
//   };

//   const confirmDateSelection = () => {
//     setCurrentDay(tempDate);
//     setShowDatePicker(false);
//   };

//   const cancelDateSelection = () => {
//     setTempDate(currentDay);
//     setShowDatePicker(false);
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     refetchDeposit();
//     refetchCashout();
//     setTimeout(() => setRefreshing(false), 1000);
//   }, [refetchDeposit, refetchCashout]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       title: "Warehouser Balance",
//       headerStyle: { backgroundColor: "#000" },
//       headerLeft: () => (
//         <Link href="/" className="ms-2">
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </Link>
//       ),
//       headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#fff" },
//       headerTitleAlign: "center",
//       headerShown: true,
//     });
//   }, [navigation, id]);

//   const renderRow = ({ item }) => (
//     <View className="flex-row py-2 bg-white mx-[1px]">
//       <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.date}</Text>
//       <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.entryBy}</Text>
//       <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.category}</Text>
//       <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.mode}</Text>
//       <Text className="flex-[1] text-[11px] font-semibold text-green-600 px-1 mx-[1px]">
//         {item.cashIn ?? "-"}
//       </Text>
//       <Text className="flex-[1] text-[11px] font-semibold text-red-600 px-1 mx-[1px]">
//         {item.cashOut ?? "-"}
//       </Text>
//       <Text className="flex-[1] text-[12px] font-bold px-1 mx-[1px]">{item.balance}</Text>
//     </View>
//   );

//   if (depositLoading || cashoutLoading)
//     return <ActivityIndicator size="large" color="blue" className="mt-4" />;
//   if (!transactions.length)
//     return <Text className="text-center mt-4 text-gray-400">No transactions found</Text>;

//   return (
//     <>
//       <StatusBar style="light" backgroundColor="#000" />

//       {/* Table Header */}
//       <View className="flex-row bg-gray-300 py-2 mx-[1px]">
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Date</Text>
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Entry By</Text>
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Category</Text>
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Mode</Text>
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Cash In</Text>
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Cash Out</Text>
//         <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Balance</Text>
//       </View>

//       {/* Transactions */}
//       <FlatList
//         data={transactions}
//         renderItem={renderRow}
//         keyExtractor={(item, index) => index.toString()}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//       />

//       {/* Date Picker Modal */}
//       <Modal visible={showDatePicker} transparent animationType="fade">
//         <View className="flex-1 bg-black/70 justify-center items-center">
//           <View className="bg-black-200 rounded-2xl p-6 mx-4 w-full">
//             <View className="flex-row justify-between items-center mb-6">
//               <Text className="text-white text-xl font-semibold">Select Date</Text>
//               <TouchableOpacity onPress={cancelDateSelection}>
//                 <Ionicons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             <DateTimePicker
//               value={tempDate}
//               mode="date"
//               display={Platform.OS === "ios" ? "spinner" : "default"}
//               onChange={handleDateChange}
//               maximumDate={new Date()}
//               textColor="#fff"
//               style={{ backgroundColor: "transparent", width: Platform.OS === "ios" ? "100%" : "auto" }}
//             />

//             {Platform.OS === "ios" && (
//               <View className="flex-row justify-end gap-2 mt-6">
//                 <TouchableOpacity onPress={cancelDateSelection} className="px-6 py-3 rounded-lg bg-gray-600">
//                   <Text className="text-white font-semibold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={confirmDateSelection} className="px-6 py-3 rounded-lg bg-primary">
//                   <Text className="text-black font-semibold">Confirm</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default WarehouserBalance;



import { useGlobalContext } from "@/context/GlobalProvider";
import { useTransactionListQuery } from "@/store/api/transactionApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, subDays } from "date-fns";
import { Link, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WarehouserBalance = () => {
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  /* 🔹 API CALL (NO DATE FILTER) */
  const {
    data: depositData,
    isLoading: depositLoading,
    refetch: refetchDeposit,
  } = useTransactionListQuery({
    warehouse: userInfo?.warehouse,
    type: "deposit",
  });

  const {
    data: cashoutData,
    isLoading: cashoutLoading,
    refetch: refetchCashout,
  } = useTransactionListQuery({
    warehouse: userInfo?.warehouse,
    type: "cashOut",
  });

  /* 🔹 FRONTEND 30 DAYS FILTER */
  useEffect(() => {
    const startRange = subDays(currentDay, 29);
    const endRange = currentDay;

    const deposits = Array.isArray(depositData?.transactions)
      ? depositData.transactions
      : [];
    const cashouts = Array.isArray(cashoutData?.transactions)
      ? cashoutData.transactions
      : [];

    const normalize = (t: any, kind: "in" | "out") => {
      const txDate = new Date(t.date);
      if (txDate < startRange || txDate > endRange) return null;

      return {
        rawDate: txDate,
        date: format(txDate, "dd MMM yyyy"),
        entryBy: t.name || "-",
        category: t.note || "-",
        mode: "Cash",
        cashIn: kind === "in" ? t.amount : null,
        cashOut: kind === "out" ? t.amount : null,
      };
    };

    const combined = [
      ...deposits.map((t) => normalize(t, "in")),
      ...cashouts.map((t) => normalize(t, "out")),
    ]
      .filter(Boolean)
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

    let balance = 0;
    const withBalance = combined.map((t) => {
      balance += (t.cashIn || 0) - (t.cashOut || 0);
      return { ...t, balance };
    });

    setTransactions(withBalance);
  }, [depositData, cashoutData, currentDay]);

  /* 🔹 REFRESH */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchDeposit();
    refetchCashout();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  /* 🔹 HEADER */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Warehouser Balance",
      headerStyle: { backgroundColor: "#000" },
      headerTitleStyle: { color: "#fff", fontWeight: "bold" },
      headerTitleAlign: "center",
      headerLeft: () => (
        <Link href="/" className="ms-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
      ),
    });
  }, [navigation]);

  const renderRow = ({ item }) => (
    <View className="flex-row py-2 bg-white mx-[1px]">
      <Text className="flex-1 text-[11px] px-1">{item.date}</Text>
      <Text className="flex-1 text-[11px] px-1">{item.entryBy}</Text>
      <Text className="flex-1 text-[11px] px-1">{item.category}</Text>
      <Text className="flex-1 text-[11px] px-1">{item.mode}</Text>
      <Text className="flex-1 text-[11px] text-green-600 font-semibold px-1">
        {item.cashIn ?? "-"}
      </Text>
      <Text className="flex-1 text-[11px] text-red-600 font-semibold px-1">
        {item.cashOut ?? "-"}
      </Text>
      <Text className="flex-1 text-[12px] font-bold px-1">
        {item.balance}
      </Text>
    </View>
  );

  if (depositLoading || cashoutLoading) {
    return <ActivityIndicator size="large" className="mt-6" />;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />

      {/* 🔹 DATE RANGE LABEL */}
      <TouchableOpacity
        onPress={() => {
          setTempDate(currentDay);
          setShowDatePicker(true);
        }}
      >
        <Text className="text-center text-xs text-gray-500 my-2">
          Last 30 days ({format(subDays(currentDay, 29), "dd MMM yyyy")} –{" "}
          {format(currentDay, "dd MMM yyyy")})
        </Text>
      </TouchableOpacity>

      {/* 🔹 TABLE HEADER */}
      <View className="flex-row bg-gray-300 py-2 mx-[1px]">
        {["Date", "Entry", "Category", "Mode", "In", "Out", "Balance"].map(
          (h) => (
            <Text key={h} className="flex-1 font-bold text-[12px] px-1">
              {h}
            </Text>
          )
        )}
      </View>

      <FlatList
        data={transactions}
        renderItem={renderRow}
        keyExtractor={(_, i) => i.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text className="text-center mt-6 text-gray-400">
            No transactions found
          </Text>
        }
      />

      {/* 🔹 DATE PICKER */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="bg-black rounded-2xl p-6 w-[90%]">
            <Text className="text-white text-lg mb-4">Select Date</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              maximumDate={new Date()}
              onChange={(_, d) => d && setTempDate(d)}
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity
                onPress={() => {
                  setCurrentDay(tempDate);
                  setShowDatePicker(false);
                }}
                className="mt-4 bg-primary py-3 rounded-lg"
              >
                <Text className="text-center font-semibold">Confirm</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default WarehouserBalance;
