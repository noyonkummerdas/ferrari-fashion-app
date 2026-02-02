// import { Colors } from "@/constants/Colors";
// import { useGlobalContext } from "@/context/GlobalProvider";
// import { useTransactionListQuery } from "@/store/api/transactionApi";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { addDays, format, isToday, subDays } from "date-fns";
// import { router, useNavigation } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useLayoutEffect, useState } from "react";
// import {
//   Modal,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from "react-native";

// const CashOutList = () => {
//   const colorScheme = useColorScheme();
//   const navigation = useNavigation();
//   const { userInfo } = useGlobalContext();
//   // Date state management
//   const [currentDay, setCurrentDay] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [tempDate, setTempDate] = useState(new Date());

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <View className="flex flex-row me-4">
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={24} color="#ffffff" />
//           </TouchableOpacity>
//         </View>
//       ),
//       title: "Cash Out List",
//       headerStyle: {
//         // backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
//         backgroundColor : '#000000'
//       },
//       headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
//       headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
//       headerShadowVisible: false,
//       headerTitleAlign: "center",
//       headerShown: true,

//       // headerRight: () => <View className="me-4" />,
//        headerRight: () => (
//         <View className="me-4">
//           <TouchableOpacity
//             onPress={() => router.push("/(drawer)/(tabs)/(account)/cashOut")}
//             className="flex flex-row justify-center items-center gap-2"
//           >
//             <MaterialIcons name="inventory" size={22} color="#ffffff" />
//             <Text className="text-gray-200 text-lg" >Add</Text>
//           </TouchableOpacity>
//         </View>
//       )
//     });
//   }, [navigation]); 

//   const { data, isSuccess, isLoading, error, isError, refetch } =
//     useTransactionListQuery({
//       warehouse: userInfo?.warehouse,
//       type: "cashOut",
//       date: format(currentDay, "MM-dd-yyyy"),
//       forceRefetch: true,
//     });
//     // console.log("CASHOUT LIST DATA", data);

//   useEffect(() => {
//     if (userInfo?.warehouse) {
//       refetch();
//     }
//   }, [userInfo?.warehouse, currentDay]);

//   const [cashOutList, setCashOutList] = useState<any[]>([]);

//   useEffect(() => {
//     if (data) {
//       // Handle different possible response structures
//       if (Array.isArray(data)) {
//         setCashOutList(data);
//       } else if (
//         data &&
//         typeof data === "object" &&
//         "transactions" in data &&
//         Array.isArray((data as any).transactions)
//       ) {
//         setCashOutList((data as any).transactions);
//       } else {
//         setCashOutList([]);
//       }
//     }
//   }, [data, isSuccess]);

//   //date formatting
//   const formattedDate = {
//     day: currentDay.getDate(),
//     month: currentDay.toLocaleString("en-US", { month: "long" }), // e.g. August
//     year: currentDay.getFullYear(),
//   };

//   const [search, setSearch] = useState("");
//   const filteredList = cashOutList.filter(
//     (item) =>
//       item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
//       item?.amount?.toString()?.includes(search) ||
//       item?.date?.includes(search),
//   );

//   // Date navigation functions
//   const goToPreviousDay = () => {
//     setCurrentDay((prev) => subDays(prev, 1));
//   };

//   const goToNextDay = () => {
//     if (!isToday(currentDay)) {
//       setCurrentDay((prev) => addDays(prev, 1));
//     }
//   };

//   const openDatePicker = () => {
//     setTempDate(currentDay);
//     setShowDatePicker(true);
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     if (Platform.OS === "android") {
//       setShowDatePicker(false);
//     }

//     if (selectedDate) {
//       setTempDate(selectedDate);
//     }
//   };

//   const confirmDateSelection = () => {
//     setCurrentDay(tempDate);
//     setShowDatePicker(false);
//   };

//   const cancelDateSelection = () => {
//     setTempDate(currentDay);
//     setShowDatePicker(false);
//   };

//   console.log("SUMMARY", (data as any)?.summary);
//   return (
//     <>      

//       <StatusBar style="light" backgroundColor="#000" />
//       <ScrollView>
//           {/* calendar */}

//       <View className="mt-2 mb-2">
//         <View className="flex flex-row justify-between items-center bg-black-200  mx-4 p-2 rounded-lg">
//           <TouchableOpacity onPress={goToPreviousDay} className="p-2">
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openDatePicker}
//             className="flex flex-row items-center px-4  rounded-lg"
//           >
//             <Text className="text-white text-lg me-2">{formattedDate.day}</Text>
//             <Text className="text-primary text-lg">
//               {formattedDate.month}
//             </Text>
//             <Text className="text-white text-lg ml-2">
//               {formattedDate.year}
//             </Text>
//             <Ionicons
//               name="calendar-outline"
//               size={20}
//               color="#fdb714"
//               className="ml-2"
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={goToNextDay}
//             disabled={isToday(currentDay)}
//             className={`p-2 ${isToday(currentDay) ? "opacity-50" : ""}`}
//           >
//             <Ionicons
//               name="arrow-forward"
//               size={24}
//               color={isToday(currentDay) ? "#666" : "white"}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Date Picker Modal */}
//       <Modal visible={showDatePicker} transparent={true} animationType="fade">
//         <View className="flex-1 bg-black/70 justify-center items-center">
//           <View className="bg-black-200 rounded-2xl px-4 py-4 w-full">
//             <View className="flex-row justify-between items-center mb-6">
//               <Text className="text-white text-xl font-semibold">
//                 Select Date
//               </Text>
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
//               textColor="#ffffff"
//               style={{
//                 backgroundColor: "transparent",
//                 width: Platform.OS === "ios" ? "100%" : "auto",
//               }}
//             />

//             {Platform.OS === "ios" && (
//               <View className="flex-row justify-end gap-2 space-x-3 mt-6">
//                 <TouchableOpacity
//                   onPress={cancelDateSelection}
//                   className="px-6 py-3 rounded-lg bg-gray-600"
//                 >
//                   <Text className="text-white font-semibold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={confirmDateSelection}
//                   className="px-6 py-3 rounded-lg bg-primary"
//                 >
//                   <Text className="text-black font-semibold">Confirm</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>

//       <View className="bg-zinc-800 mb-2 text-white h-14 rounded-full flex-row items-center px-3 py-2 mt-2 mx-4">
//         <TextInput
//           className="ml-2 flex-1 text-white"
//           value={search}
//           onChangeText={setSearch}
//           placeholder="Search by name, amount, or date"
//           placeholderTextColor="#d1d5db"
//           style={{
//             backgroundColor: "transparent",
//             borderWidth: 0,
//             width: "100%",
//           }}
//         />
//         <Ionicons name="search" size={20} color="#fdb714" />
//       </View>

//       {filteredList?.length > 0 ? (
//         filteredList?.map((item) => (
//           <View key={item._id} className="mt-4 mx-4">
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: "/cashOutDetails",
//                   params: { _id: item?._id },
//                 })
//               }
//               className="flex-row justify-between bg-black-200 rounded-xl p-4 items-center"
//             >
//               <View className="flex flex-col items-start">
//                 <Text className="text-lg font-medium text-primary">
//                   {item.name}
//                 </Text>
//                 <Text className="text-sm text-gray-200">
//                   {item?.date && format(new Date(item?.date), "dd-MM-yyyy")}
//                 </Text>
//               </View>
//               <View>
//                 <View className="flex-row items-center gap-2">
//                   <Text className="text-sm text-primary capitalize">
//                   {item.type}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() =>
//                   router.push({
//                   pathname: "(drawer)/(tabs)/(account)/cashoutInvoicePhoto",
//                   params: {
//                   invoice: item?.invoices,
//                   photo: item?.photo,
//                 },
//               })
//             }
//                 >
//                   <Text className="text-sm text-white border border-gray-300 ml-4 px-2 px-1 rounded-lg">
//                   Photo 
//                   </Text>
//                 </TouchableOpacity>
//                   </View>
//                 <Text className="text-lg text-primary">
//                   ৳{item.amount?.toLocaleString()}{" "}
//                   <Text className="text-white">BDT</Text>
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         ))
//       ) : (
//         <View className="flex-1 h-96 w-full justify-center items-center mt-10">
//           <Ionicons name="save-outline" size={60} color="gray" />
//           <Text className="text-primary text-lg mt-4">No data found</Text>
//           <Text className="text-white text-sm">
//             Please select a different date
//           </Text>
//         </View>
//       )}
//     </ScrollView>
//     </>
//   );
// };

// export default CashOutList;


import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTransactionListQuery } from "@/store/api/transactionApi";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addMonths, format, subMonths } from "date-fns";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const CashOutList = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  const [currentDay, setCurrentDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [cashOutList, setCashOutList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Cash Out List",
      headerStyle: { backgroundColor: "#000000" },
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerRight: () => (
        <View className="me-4">
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(tabs)/(account)/cashOut")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <MaterialIcons name="inventory" size={22} color="#ffffff" />
            <Text className="text-gray-200 text-lg">Add</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // Backend call
  const { data, isSuccess, refetch } = useTransactionListQuery({
    warehouse: userInfo?.warehouse,
    type: "cashOut",
    date: format(currentDay, "MM-dd-yyyy"),
    forceRefetch: true,
  });

  useEffect(() => {
    if (userInfo?.warehouse) refetch();
  }, [userInfo?.warehouse, currentDay]);

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) setCashOutList(data);
      else if (data?.transactions) setCashOutList(data.transactions);
      else setCashOutList([]);
    }
  }, [data, isSuccess]);

  // Monthly filter
  const filteredList = cashOutList.filter(item => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getMonth() === currentDay.getMonth() &&
      itemDate.getFullYear() === currentDay.getFullYear()
    );
  });

  // Group by date
  const groupedByDate = filteredList.reduce((acc, item) => {
    const dateKey = format(new Date(item.date), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Month navigation
  const goToPreviousMonth = () => setCurrentDay(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDay(prev => addMonths(prev, 1));

  // Date picker
  const openDatePicker = () => { setTempDate(currentDay); setShowDatePicker(true); };
  const handleDateChange = (e: any, selected?: Date) => { if (selected) setTempDate(selected); if (Platform.OS === 'android') setShowDatePicker(false); };
  const confirmDateSelection = () => { setCurrentDay(tempDate); setShowDatePicker(false); };
  const cancelDateSelection = () => { setTempDate(currentDay); setShowDatePicker(false); };

  const formattedDate = {
    month: currentDay.toLocaleString("en-US", { month: "long" }),
    year: currentDay.getFullYear(),
  };

  // Search applied after grouping
  const searchedList = Object.keys(groupedByDate).reduce((acc, date) => {
    const filteredItems = groupedByDate[date].filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.amount.toString().includes(search) ||
      format(new Date(item.date), "dd-MM-yyyy").includes(search)
    );
    if (filteredItems.length > 0) acc[date] = filteredItems;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />
      <ScrollView className="pb-10">

        {/* Month navigation */}
        <View className="mt-2 mb-2">
          <View className="flex flex-row justify-between items-center bg-black-200 mx-4 p-2 rounded-lg">
            <TouchableOpacity onPress={goToPreviousMonth}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={openDatePicker} className="flex flex-row items-center">
              <Text className="text-white text-lg me-2">{formattedDate.month}</Text>
              <Text className="text-white text-lg">{formattedDate.year}</Text>
              <Ionicons name="calendar-outline" size={20} color="#fdb714" className="ml-2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextMonth}><Ionicons name="arrow-forward" size={24} color="white" /></TouchableOpacity>
          </View>
        </View>

        {/* Date picker modal */}
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View className="flex-1 bg-black/70 justify-center items-center">
            <View className="bg-black-200 rounded-2xl px-4 py-4 w-full">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-xl font-semibold">Select Date</Text>
                <TouchableOpacity onPress={cancelDateSelection}><Ionicons name="close" size={24} color="#666" /></TouchableOpacity>
              </View>
              <DateTimePicker value={tempDate} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleDateChange} maximumDate={new Date()} textColor="#ffffff" />
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

        {/* Search */}
        <View className="bg-zinc-800 mb-2 text-white h-14 rounded-full flex-row items-center px-3 py-2 mt-2 mx-4">
          <TextInput className="ml-2 flex-1 text-white" value={search} onChangeText={setSearch} placeholder="Search by name, amount, or date" placeholderTextColor="#d1d5db" />
          <Ionicons name="search" size={20} color="#fdb714" />
        </View>

        {/* Render grouped transactions */}
        {Object.keys(searchedList).length > 0 ? (
          Object.keys(searchedList).map(date => (
            <View key={date} className="mb-4">
              {/* <Text className="text-white text-lg font-bold mx-4 mt-2">{format(new Date(date), "dd MMM yyyy")}</Text> */}
              {searchedList[date].map((item, index) => (
                <TouchableOpacity key={item._id || index} onPress={() => router.push({ pathname: "/cashOutDetails", params: { _id: item._id } })} className="flex-row justify-between bg-black-200 rounded-xl p-4 mx-4 mt-2 items-center">
                  <View className="flex flex-col items-start">
                    <Text className="text-lg font-medium text-primary">{item.name}</Text>
                    <Text className="text-sm text-gray-200">{format(new Date(item.date), "dd-MM-yyyy")}</Text>
                  </View>
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-primary capitalize">{item.type}</Text>
                      {item.photo && <Text className="text-sm text-white border border-gray-300 ml-4 px-2 rounded-lg">Photo</Text>}
                    </View>
                    <Text className="text-lg text-primary">৳{item.amount?.toLocaleString()} <Text className="text-white">BDT</Text></Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View className="flex-1 h-96 w-full justify-center items-center mt-10">
            <Ionicons name="save-outline" size={60} color="gray" />
            <Text className="text-primary text-lg mt-4">No data found</Text>
            <Text className="text-white text-sm">Please select a different month</Text>
          </View>
        )}

      </ScrollView>
    </>
  );
};

export default CashOutList;
