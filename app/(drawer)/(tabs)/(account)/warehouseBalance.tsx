// import { useGlobalContext } from "@/context/GlobalProvider";
// import { useTransactionListQuery } from "@/store/api/transactionApi";
// import { useWarehouseQuery } from "@/store/api/warehouseApi";
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

//   const startDate = format(subDays(currentDay, 29), "MM-dd-yyyy");
//   const endDate = format(currentDay, "MM-dd-yyyy");

//   const { data: warehouseInfo } = useWarehouseQuery(userInfo?.warehouse, { skip: !userInfo?.warehouse });
//   const Balance = warehouseInfo?.currentBalance || 0;
//   console.log("Balance", Balance);

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

//   // Refresh on date/id change
//   useEffect(() => {
//     refetchDeposit();
//     refetchCashout();
//   }, [id, currentDay]);

//   useEffect(() => {
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
//     ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     // Calculate running balance
//     let balance = 0;
//     const withBalance = combined.map((t) => {
//       balance += (t.cashIn || 0) - (t.cashOut || 0);
//       return { ...t, balance };
//     });

//     setTransactions(withBalance);
//   }, [depositData, cashoutData]);

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
//       title: "Pritty Cash Balance",
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
import { useWarehouseQuery } from "@/store/api/warehouseApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
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
  useColorScheme,
  View,
} from "react-native";

const WarehouserBalance = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  const [id, setId] = useState("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const startDate = format(subDays(currentDay, 29), "MM-dd-yyyy");
  const endDate = format(currentDay, "MM-dd-yyyy");

  // Get warehouse info
  const { data: warehouseInfo } = useWarehouseQuery(userInfo?.warehouse, { skip: !userInfo?.warehouse });
  const Balance = warehouseInfo?.currentBalance || 0;

  // Set warehouse id for user/admin
  useEffect(() => {
    if (userInfo?.type === "admin") setId("all");
    else setId(userInfo?.warehouse);
  }, [userInfo]);

  // Fetch deposits
  const { data: depositData, isLoading: depositLoading, refetch: refetchDeposit } =
    useTransactionListQuery({
      warehouse: userInfo?.warehouse,
      type: "deposit",
      date: format(currentDay, "MM-dd-yyyy"),
      startDate,
      endDate,
      forceRefetch: true,
    });

  // Fetch cashouts
  const { data: cashoutData, isLoading: cashoutLoading, refetch: refetchCashout } =
    useTransactionListQuery({
      warehouse: userInfo?.warehouse,
      type: "cashOut",
      date: format(currentDay, "MM-dd-yyyy"),
      startDate,
      endDate,
      forceRefetch: true,
    });

  // Refresh on date/id change
  useEffect(() => {
    refetchDeposit();
    refetchCashout();
  }, [id, currentDay]);

  // Process transactions & calculate running balance
  useEffect(() => {
    const deposits = Array.isArray(depositData?.transactions) ? depositData.transactions : [];
    const cashouts = Array.isArray(cashoutData?.transactions) ? cashoutData.transactions : [];

    const combined = [
      ...deposits.map((t) => {
        const date = t.date ? new Date(t.date) : null;
        const validDate = date && !isNaN(date.getTime());
        return {
          date: validDate ? format(date, "dd MMM yyyy") : "N/A",
          entryBy: t.name || "-",
          category: t.note || "-",
          mode: "Cash",
          cashIn: t.amount,
          cashOut: null,
        };
      }),
      ...cashouts.map((t) => {
        const date = t.date ? new Date(t.date) : null;
        const validDate = date && !isNaN(date.getTime());
        return {
          date: validDate ? format(date, "dd MMM yyyy") : "N/A",
          entryBy: t.name || "-",
          category: t.note || "-",
          mode: "Cash",
          cashIn: null,
          cashOut: t.amount,
        };
      }),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Correct running balance calculation
    const totalDeposits = deposits.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalCashouts = cashouts.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Opening balance before today
    let runningBalance = Balance - totalDeposits + totalCashouts;

    const withBalance = combined.map((t) => {
      runningBalance += (t.cashIn || 0) - (t.cashOut || 0);
      return { ...t, balance: runningBalance };
    });

    setTransactions(withBalance);
  }, [depositData, cashoutData, Balance]);

  const goToPreviousDay = () => setCurrentDay((prev) => subDays(prev, 1));
  const goToNextDay = () => {
    if (!isToday(currentDay)) setCurrentDay((prev) => addDays(prev, 1));
  };

  const openDatePicker = () => {
    setTempDate(currentDay);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmDateSelection = () => {
    setCurrentDay(tempDate);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setTempDate(currentDay);
    setShowDatePicker(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchDeposit();
    refetchCashout();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refetchDeposit, refetchCashout]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Pritty Cash Balance",
      headerStyle: { backgroundColor: "#000" },
      headerLeft: () => (
        <Link href="/" className="ms-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
      ),
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#fff" },
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation, id]);

  const renderRow = ({ item }) => (
    <View className="flex-row py-2 bg-white mx-[1px]">
      <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.date}</Text>
      <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.entryBy}</Text>
      <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.category}</Text>
      <Text className="flex-[1] text-[11px] px-1 mx-[1px]">{item.mode}</Text>
      <Text className="flex-[1] text-[11px] font-semibold text-green-600 px-1 mx-[1px]">
        {item.cashIn ?? "-"}
      </Text>
      <Text className="flex-[1] text-[11px] font-semibold text-red-600 px-1 mx-[1px]">
        {item.cashOut ?? "-"}
      </Text>
      <Text className="flex-[1] text-[12px] font-bold px-1 mx-[1px]">{item.balance}</Text>
    </View>
  );

  if (depositLoading || cashoutLoading)
    return <ActivityIndicator size="large" color="blue" className="mt-4" />;
  if (!transactions.length)
    return <Text className="text-center mt-4 text-gray-400">No transactions found</Text>;

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />

      {/* Table Header */}
      <View className="flex-row bg-gray-300 py-2 mx-[1px]">
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Date</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Entry By</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Category</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Mode</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Cash In</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Cash Out</Text>
        <Text className="flex-[1] font-bold text-[12px] px-1 mx-[1px]">Balance</Text>
      </View>

      {/* Transactions */}
      <FlatList
        data={transactions}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="bg-black-200 rounded-2xl p-6 mx-4 w-full">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-semibold">Select Date</Text>
              <TouchableOpacity onPress={cancelDateSelection}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor="#fff"
              style={{ backgroundColor: "transparent", width: Platform.OS === "ios" ? "100%" : "auto" }}
            />

            {Platform.OS === "ios" && (
              <View className="flex-row justify-end gap-2 mt-6">
                <TouchableOpacity onPress={cancelDateSelection} className="px-6 py-3 rounded-lg bg-gray-600">
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDateSelection} className="px-6 py-3 rounded-lg bg-primary">
                  <Text className="text-black font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default WarehouserBalance;

