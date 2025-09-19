import { Colors } from "@/constants/Colors";
import { useWarehouseQuery } from "@/store/api/warehouseApi";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { Link, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const WarehouserDetails = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // Warehouse data fetching
  const { data, isLoading, refetch, isSuccess } = useWarehouseQuery({
    _id: id,
    date:currentDay
  });
  
  // console.log('warehouse data', data)

  // Whenever data changes, update transactions
  useEffect(() => {
    if (data?.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions);
    }
  }, [data, isSuccess]);

  // Refetch whenever warehouse ID changes
  useEffect(() => {
    refetch();
  }, [id]);

  // Refetch when screen comes into focus (live update after stock change)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [id])
  );

  // Filter transactions by selected day
  const dayTransactions = transactions.filter(
    (t) => t.date === format(currentDay, "yyyy-MM-dd")
  );

  const formattedDate = {
    day: currentDay.getDate(),
    month: currentDay.toLocaleString("en-US", { month: "long" }),
    year: currentDay.getFullYear(),
  };

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
    refetch();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refetch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Warehouse Details",
      headerStyle: {
        // backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
        backgroundColor: '#000000',
      },
      headerLeft: () => (
        <Link href="/warehouse" className="ms-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
      ),
      headerRight: () => (
        <View className="flex flex-row items-center me-4">
          <Link href={`/warehouse/${id}`} className="text-white">
            <Text className="text-gray-200 text-lg">Update</Text>
          </Link>
        </View>
      ),
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#ffffff",
      },
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation, id]);

  const renderHeader = () => (
    <View>
      <View className=" p-4 space-x-2">
        <View className="flex flex-row">
          <View className="flex flex-row justify-center items-center mb-1">
            {data?.type === "factory" ? (
              <MaterialIcons name="factory" size={22} color="#fdb714" className="me-2" />
            ) : (
              <MaterialIcons name="storefront" size={22} color="#fdb714" className="me-2" />
            )}
            <Text className="text-gray-200 text-lg">{data?.warehouse?.name}</Text>
          </View>
        </View>
        <View className="flex flex-row">
          <Ionicons name="phone-portrait-sharp" size={18} color={"#fdb714"} />
          <Text className="text-gray-200 text-[18px] ms-2">{data?.warehouse?.phone}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Ionicons name="location-outline" size={18} color={"#fdb714"} />
          <Text className="text-gray-400 p-1 ms-2">{data?.warehouse?.address}</Text>
        </View>
      </View>

      {/* 🔹 Date navigation */}
      <View className="m-2 flex-1">
        <View className="flex flex-row justify-between items-center bg-black-200 p-2 rounded-lg">
          <TouchableOpacity onPress={goToPreviousDay} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openDatePicker} className="flex flex-row items-center px-4 rounded-lg">
            <Text className="text-white text-lg me-2">{formattedDate.day}</Text>
            <Text className="text-primary text-lg">{formattedDate.month}</Text>
            <Text className="text-white text-lg ml-2">{formattedDate.year}</Text>
            <Ionicons name="calendar-outline" size={20} color="#fdb714" className="ml-2" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextDay}
            disabled={isToday(currentDay)}
            className={`p-2 ${isToday(currentDay) ? "opacity-50" : ""}`}
          >
            <Ionicons name="arrow-forward" size={24} color={isToday(currentDay) ? "#666" : "white"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Balance Section */}
      <View className="flex flex-row justify-evenly items-center mt-2 w-full ">
        <View className="flex bg-black-200 items-center justify-center p-5 text-center rounded-lg m-1">
          <Text className="text-white text-xl p-3">Opening Balance</Text>
          <Text className="text-primary font-bold text-center text-xl">
            {data?.warehouse?.openingBalance ?? 0}
          </Text>
        </View>
        <View className="flex bg-black-200 items-center justify-center p-5 text-center rounded-lg m-1">
          <Text className="text-white text-xl p-3">Current Balance</Text>
          <Text className="text-primary font-bold text-center text-xl">
            {data?.warehouse?.currentBalance ?? 0}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) return <ActivityIndicator size="large" color="blue" />;
  if (!data) return <Text className="text-center mt-4 text-gray-400">No data found</Text>;

  return (
    <>
      <StatusBar style="light" backgroundColor="#1f2937" />
      <FlatList
        data={data?.transaction}
        keyExtractor={(item, index) => item._id}
        renderItem={({ item }) => (
          <View className="bg-black p-4 rounded-lg mt-4 mx-4 h-20 flex justify-between">
            <Text className="text-white text-xl">{item.type}</Text>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white text-md">
              {format(new Date(item?.createdAt), "dd MMM yyyy, h:mm a")}
              </Text>
              <Text className="text-primary text-lg font-bold">{item.amount} <Text className="text-white">BDT</Text></Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-400 mt-4">No transactions available</Text>}
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <Modal visible={showDatePicker} transparent={true} animationType="fade">
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
              textColor="#ffffff"
              style={{ backgroundColor: "transparent", width: Platform.OS === "ios" ? "100%" : "auto" }}
            />
            {Platform.OS === "ios" && (
              <View className="flex-row justify-end gap-2 space-x-3 mt-6">
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

export default WarehouserDetails;
