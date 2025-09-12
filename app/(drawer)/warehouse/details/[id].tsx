import { useWarehouseQuery } from "@/store/api/warehouseApi";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { addDays, format, isToday, subDays } from "date-fns";
import {
  FlatList,
  Text,
  Platform,
  Modal,
  TouchableOpacity,
  useColorScheme,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";

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

  const { data, isLoading, isError, refetch, isSuccess } = useWarehouseQuery(id ?? "", {
    skip: !id,
  });

  useEffect(() => {
    if (data?.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    refetch();
  }, [id]);

  const dayTransactions = transactions.filter(
    (t) => t.date === format(currentDay, "yyyy-MM-dd")
  );

  const totalStockIn = dayTransactions
    .filter((t) => t.type === "stock-in")
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalStockOut = dayTransactions
    .filter((t) => t.type === "stock-out")
    .reduce((sum, t) => sum + t.quantity, 0);

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
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
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
      {/* Warehouse Info */}
      <View className="mb-4 px-6 space-x-2">
        <View className="flex flex-row">
          <Ionicons name="business-outline" size={18} color={"#fdb714"} />
          <Text className="text-gray-200 text-lg ms-2">{data?.name}</Text>
        </View>
        <View className="flex flex-row">
          <Ionicons name="phone-portrait-sharp" size={18} color={"#fdb714"} />
          <Text className="text-gray-200 text-[18px] ms-2">{data?.phone}</Text>
        </View>
        <View className="flex flex-row">
          <Ionicons name="location-outline" size={16} color={"#fdb714"} />
          <Text className="text-gray-400 p-1 ms-2">{data?.address}</Text>
        </View>
      </View>

      {/* Calendar */}
      <View className="mt-2 mb-2 px-6">
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

          <TouchableOpacity onPress={goToNextDay} disabled={isToday(currentDay)} className={`p-2 ${isToday(currentDay) ? "opacity-50" : ""}`}>
            <Ionicons name="arrow-forward" size={24} color={isToday(currentDay) ? "#666" : "white"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stock Section */}
      <View className="flex flex-row justify-between items-center mt-4 w-[400px] mx-auto">
        <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
          <Text className="text-white text-xl">Stock In Today</Text>
          <Text className="text-primary font-bold text-center text-xl">{totalStockIn}</Text>
        </View>
        <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
          <Text className="text-white text-xl">Stock Out Today</Text>
          <Text className="text-primary font-bold text-center text-xl">{totalStockOut}</Text>
        </View>
      </View>

      <View className="flex flex-row justify-between items-center mt-4 w-[400px] mx-auto">
        <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
          <Text className="text-white text-xl">Current Stock</Text>
          <Text className="text-primary font-bold text-center text-xl">{data?.currentStock || 0}</Text>
        </View>
        <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
          <Text className="text-white text-xl">Total Stock</Text>
          <Text className="text-primary font-bold text-center text-xl">{data?.totalStock || 0}</Text>
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
        data={dayTransactions.filter(t => t.type === "stock-in" || t.type === "stock-out")}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="bg-black p-4 rounded-lg mt-4 mx-4 h-20 flex justify-between">
            <Text className="text-white text-xl">
              {item.type === "stock-in" ? "Stock In" : "Stock Out"}
            </Text>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white text-lg">
                {formattedDate.day} <Text className="text-primary">{formattedDate.month}</Text> {formattedDate.year}
              </Text>
              <Text className="text-primary font-bold">
                {item.quantity} <Text className="text-white">PCS</Text>
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-400 mt-4">No stock transactions available</Text>}
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Date Picker Modal */}
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
