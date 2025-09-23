import { useGlobalContext } from "@/context/GlobalProvider";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addMonths, format, isThisMonth, subMonths } from "date-fns";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from "react-native";

const CustomerDetails = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { userInfo } = useGlobalContext();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [paymentList, setPaymentList] = useState<any[]>([]);

  // Fetch customer data
  const { data, refetch, isSuccess } = useGetCustomerByIdQuery({
    id,
    date: format(currentMonth, "MM-dd-yyyy") // API call month-wise
  });
  // console.log("Customer Data:", data);

  useEffect(() => {
    refetch();
  }, [id, currentMonth]);

  useEffect(() => {
    if (data?.transactions && Array.isArray(data.transactions)) {
      setPaymentList(data.transactions);
    }
  }, [data, isSuccess]);

  // Filter transactions of selected month
  const monthTransactions = paymentList.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth.getMonth() &&
           transactionDate.getFullYear() === currentMonth.getFullYear();
  });

  // Month navigation
  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => {
    if (!isThisMonth(currentMonth)) setCurrentMonth(prev => addMonths(prev, 1));
  };

  // Month Picker
  const openDatePicker = () => { setTempDate(currentMonth); setShowDatePicker(true); };
  const cancelDateSelection = () => { setTempDate(currentMonth); setShowDatePicker(false); };
  const confirmDateSelection = () => { setCurrentMonth(tempDate); setShowDatePicker(false); };

  // Month-only selection (day ignored)
  const handleMonthChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      if (Platform.OS === "ios") setTempDate(newMonth);
      else setCurrentMonth(newMonth);
    }
  };

  // Header setup
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${data?.customer?.name || "Customer Details"}`,
      headerStyle: { backgroundColor: "#000000" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push(`/customer/${id}`)} className="flex flex-row items-center gap-2">
          <Ionicons name="pencil-outline" size={24} color="white" />
          <Text className="text-white text-lg">Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="light" backgroundColor="#1f2937" />

      {/* Customer Info */}
      <View key={data?.customer?._id} className="mb-4 px-6 space-x-2">
        <View className="flex flex-row ">
          <Ionicons name="business-outline" size={18} color={"#fdb714"} />
          <Text className="text-gray-200 text-lg ms-2">{data?.customer?.company}</Text>
        </View>
        <View className="flex flex-row ">
          <Ionicons name="phone-portrait-sharp" size={18} color={"#fdb714"} />
          <Text className="text-gray-200 text-[18px] ms-2">{data?.customer?.phone}</Text>
        </View>
        <View className="flex flex-row ">
          <Ionicons name="location-outline" size={16} color={"#fdb714"} />
          <Text className="text-gray-400 p-1 ms-2">{data?.customer?.address}</Text>
        </View>
      </View>

      {/* Opening & Current Balance */}
      <View className="flex flex-row justify-center items-center mx-auto">
        <View className="flex bg-black-200 items-center justify-center p-5 text-center w-[180px] rounded-lg m-1">
          <Text className="text-white text-xl ">Opening Balance</Text>
          <Text className="text-primary font-bold text-xl text-center">
            {data?.customer?.balance} <Text className="text-white">BDT</Text>
          </Text>
        </View>
        <View className="flex bg-black-200 items-center justify-center p-5 text-center w-[180px] rounded-lg m-1">
          <Text className="text-white text-xl">Current Balance</Text>
          <Text className="text-primary font-bold text-xl text-center">
            {data?.customer?.currentBalance}<Text className="text-white">BDT</Text>
          </Text>
        </View>
      </View>

      {/* Month Picker Navigation */}
      <View className="m-2 p-2">
        <View className="flex flex-row justify-between items-center bg-black-200 p-2 rounded-lg">
          <TouchableOpacity onPress={goToPreviousMonth} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openDatePicker} className="flex-row items-center">
            <Text className="text-primary text-lg">{format(currentMonth, "MMMM")} </Text>
            <Text className="text-white text-lg">{format(currentMonth, "yyyy")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextMonth}
            disabled={isThisMonth(currentMonth)}
            className={`p-2 ${isThisMonth(currentMonth) ? "opacity-50" : ""}`}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={isThisMonth(currentMonth) ? "#666" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Picker Modal */}
      {showDatePicker && Platform.OS === "ios" && (
        <Modal transparent animationType="fade" visible={showDatePicker}>
          <View className="flex-1 bg-black/70 justify-center items-center">
            <View className="bg-black-200 rounded-2xl p-6 mx-4 w-full">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleMonthChange}
                maximumDate={new Date()}
                textColor="#ffffff"
                style={{ width: "100%" }}
              />
              <View className="flex-row justify-end gap-2 mt-6">
                <TouchableOpacity onPress={cancelDateSelection} className="px-6 py-3 rounded-lg bg-gray-600">
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDateSelection} className="px-6 py-3 rounded-lg bg-primary">
                  <Text className="text-black font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={currentMonth}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleMonthChange}
        />
      )}

      {/* Monthly Transactions */}
      {monthTransactions.map(item => (
        <View key={item?._id} className="bg-black-200 flex justify-between p-4 rounded-lg m-4">
          <Text className="text-white text-xl">{item?.type}</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-md">{format(new Date(item?.createdAt), "dd MMM yyyy, h:mm a")}</Text>
            <Text className="text-primary text-lg font-bold">{item?.amount} <Text className="text-white">BDT</Text></Text>
          </View>
        </View>
      ))}

    </KeyboardAvoidingView>
  );
};

export default CustomerDetails;
