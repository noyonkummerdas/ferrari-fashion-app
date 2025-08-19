import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTransactionListQuery } from "@/store/api/transactionApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
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

const CashDepositList = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  // Date state management
  const [currentDay, setCurrentDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Cash Deposit List",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);

  const { data, isSuccess, isLoading, error, isError, refetch } =
    useTransactionListQuery({
      warehouse: userInfo?.warehouse,
      type: "deposit",
      date: format(currentDay, "MM-dd-yyyy"),
      forceRefetch: true,
    });

  useEffect(() => {
    if (userInfo?.warehouse) {
      refetch();
    }
  }, [userInfo?.warehouse, currentDay]);

  // console.log(data, isSuccess, isLoading, isError, error);

  const [depositList, setDepositList] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setDepositList(data);
      } else if (
        data &&
        typeof data === "object" &&
        "transactions" in data &&
        Array.isArray((data as any).transactions)
      ) {
        setDepositList((data as any).transactions);
      } else {
        setDepositList([]);
      }
    }
  }, [data, isSuccess]);

  // console.log(depositList);
  //date formatting
  const formattedDate = {
    day: currentDay.getDate(),
    month: currentDay.toLocaleString("en-US", { month: "long" }), // e.g. August
    year: currentDay.getFullYear(),
  };

  const [search, setSearch] = useState("");
  const filteredList = depositList.filter(
    (item) =>
      item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.amount?.toString()?.includes(search) ||
      item?.date?.includes(search),
  );

  // Date navigation functions
  const goToPreviousDay = () => {
    setCurrentDay((prev) => subDays(prev, 1));
  };

  const goToNextDay = () => {
    if (!isToday(currentDay)) {
      setCurrentDay((prev) => addDays(prev, 1));
    }
  };

  const openDatePicker = () => {
    setTempDate(currentDay);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmDateSelection = () => {
    setCurrentDay(tempDate);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setTempDate(currentDay);
    setShowDatePicker(false);
  };

  console.log("SUMMARY", (data as any)?.summary);
  return (
    <ScrollView>
      {/* calendar */}

      <View className="mt-2 mb-2">
        <View className="flex flex-row justify-between items-center bg-black-200  p-2 rounded-lg">
          <TouchableOpacity onPress={goToPreviousDay} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDatePicker}
            className="flex flex-row items-center px-4  rounded-lg"
          >
            <Text className="text-white text-lg me-2">{formattedDate.day}</Text>
            <Text className="text-primary text-lg">
              {formattedDate.month}
            </Text>{" "}
            <Text className="text-white text-lg ml-2">
              {formattedDate.year}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#fdb714"
              className="ml-2"
            />
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

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="bg-black-200 rounded-2xl p-6 mx-4 w-full">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-semibold">
                Select Date
              </Text>
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

      <View className="bg-zinc-800 mb-2 text-white h-14 rounded-full flex-row items-center px-3 py-2 mt-2">
        <TextInput
          className="ml-2 flex-1 text-white"
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, amount, or date"
          placeholderTextColor="#d1d5db"
          style={{
            backgroundColor: "transparent",
            // color: "primary",
            borderWidth: 0,
            width: "100%",
          }}
        />
        <Ionicons name="search" size={20} color="#fdb714" />
      </View>

      {filteredList?.length > 0 ? (
        filteredList?.map((item) => (
          <View key={item._id} className="mt-4">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/cashDepositDetails",
                  params: { _id: item?._id },
                })
              }
              className="flex-row justify-between bg-black-200 rounded-xl p-4 items-center"
            >
              <View className="flex flex-col items-start">
                <Text className="text-lg font-medium text-primary">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-200">
                  {item?.date && format(new Date(item?.date), "dd-MM-yyyy")}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-primary">{item.type}</Text>
                <Text className="text-lg text-primary">
                  {item.amount} <Text className="text-white">BDT</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View className="flex-1 h-96 w-full justify-center items-center mt-10">
          <Ionicons name="save-outline" size={60} color="gray" />
          <Text className="text-primary text-lg mt-4">No data found</Text>
          <Text className="text-white text-sm">
            Please select a different date
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default CashDepositList;
