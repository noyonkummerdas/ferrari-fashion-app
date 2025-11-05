import CustomDropdown from "@/components/CustomDropdown";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useWarehouseAccountsQuery, useWarehousesQuery } from "@/store/api/warehouseApi";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { Link, useFocusEffect, useNavigation } from "expo-router";
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

  useEffect(() => {
    if (userInfo?.type === "admin") {
      setId("all");
    } else {
      setId(userInfo?.warehouse);
    }
  }, [userInfo]);

  const { data, isLoading, refetch, isSuccess } = useWarehouseAccountsQuery({
    _id: id,
    date: format(currentDay, "yyyy-MM-dd"),
  });

  console.log("Warehouse Accounts Data:", data);

  const { data: warehouseData } = useWarehousesQuery();

  useEffect(() => {
    refetch();
  }, [id, currentDay]);

  useEffect(() => {
    if (data?.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions);
    } else {
      setTransactions([]);
    }
  }, [data, isSuccess]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [id])
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
      title: "Warehouser Balance",
      headerStyle: {
        backgroundColor: "#000000",
      },
      headerLeft: () => (
        <Link href="/" className="ms-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
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

  const warehouse = Array.isArray(data?.warehouse) ? data?.warehouse : [];

  const renderHeader = () => (
    <View>
      {/* Warehouse Dropdown for Admin */}
      {userInfo?.type === "admin" && warehouseData && (
        <View className="space-x-2">
          <CustomDropdown
            data={warehouseData?.map((wh) => ({
              label: wh.name,
              value: wh._id,
            }))}
            value={id}
            setValue={(value) => setId(value)}
            placeholder="Select Warehouse"
            mode="modal"
            placeholderStyle={{ color: "white" }}
            search={true}
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 8,
              minWidth: 190,
              height: 45,
              marginTop: 10,
            }}
            selectedTextStyle={{ color: "white" }}
            itemTextStyle={{ color: "white" }}
          />
        </View>
      )}

      {/* Date Navigation */}
      <View className="m-2 flex-1">
        <View className="flex flex-row justify-between items-center bg-black-200 p-2 rounded-lg">
          <TouchableOpacity onPress={goToPreviousDay} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDatePicker}
            className="flex flex-row items-center px-4 rounded-lg"
          >
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
            <Ionicons
              name="arrow-forward"
              size={24}
              color={isToday(currentDay) ? "#666" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Section */}
      <View className="flex flex-row justify-evenly items-center mt-2 w-full">
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
        data={data?.transaction || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="bg-black p-4 rounded-lg mt-4 mx-4 h-20 flex justify-between">
            <Text className="text-white text-xl">{item.type}</Text>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white text-md">
                {format(new Date(item?.createdAt), "dd MMM yyyy, h:mm a")}
              </Text>
              <Text
                className={`text-lg font-bold ${
                  item.type === "paymentReceived" ? "text-green-400" : "text-red-400"
                }`}
              >
                ৳{item.amount} <Text className="text-white">BDT</Text>
              </Text>
            </View>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-4">
            No transactions available
          </Text>
        }
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
              style={{
                backgroundColor: "transparent",
                width: Platform.OS === "ios" ? "100%" : "auto",
              }}
            />

            {Platform.OS === "ios" && (
              <View className="flex-row justify-end gap-2 space-x-3 mt-6">
                <TouchableOpacity
                  onPress={cancelDateSelection}
                  className="px-6 py-3 rounded-lg bg-gray-600"
                >
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDateSelection}
                  className="px-6 py-3 rounded-lg bg-primary"
                >
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
