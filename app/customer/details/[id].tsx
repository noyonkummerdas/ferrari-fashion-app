import { useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { addDays, format, formatDate, isToday, subDays } from "date-fns";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ScrollView,
  Text,
  Platform,
  Modal,
  TouchableOpacity,
  useColorScheme,
  View,
  FlatList,
  RefreshControl,
} from "react-native";





const saledata =[
  {
    id:1,
    date: {formatDate},
    newSale:290000
  },
  {
    id:2,
    date: {formatDate},
    newSale:3000000
  },
  {
    id:3,
    date: {formatDate},
    newSale:670000
  },
  {
    id:4,
    date: {formatDate},
    newSale:890000
  },
  {
    id:5,
    date: {formatDate},
    newSale:290000
  },
  {
    id:6,
    date: {formatDate},
    newSale:790000,
  },

]

const CustomerDetails = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
    const [paymentList, setPaymentList] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentDay, setCurrentDay] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
  

  const { data, isLoading, error, refetch, isSuccess } = useGetCustomerByIdQuery({ id });

  useEffect(() => {
    refetch();
  }, [id]);
  useEffect(() => {
    if (data?.transactions && Array.isArray(data.transactions)) {
      setPaymentList(data.transactions);
    }
  }, [data, isSuccess]);
  const dayTransactions = paymentList.filter(
    t => t.date === format(currentDay, "yyyy-MM-dd")
  );

  // Compute totals
  const totalSales = dayTransactions
    .filter(t => t.type === "sale")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = dayTransactions
    .filter(t => t.type === "payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = (data?.balance || 0) + totalPayments - totalSales;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${data?.name || "Customer Details"}`,
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`, //`${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      //@ts-ignore
      headerTintColor: `#ffffff`,
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
        <TouchableOpacity
          onPress={() => router.push(`/customer/${id}`)}
          className="flex flex-row items-center gap-2"
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
          <Text className="text-white text-lg">Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  //date formatting
  const [customerDetails, setCustomerDetails] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setCustomerDetails(data);
      } else if (
        data &&
        typeof data === "object" &&
        "transactions" in data &&
        Array.isArray((data as any).transactions)
      ) {
        setCustomerDetails((data as any).transactions);
      } else {
        setCustomerDetails([]);
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
  const filteredList = customerDetails.filter(
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // এখানে API call বা অন্য refresh logic যাবে
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // demo delay
  }, []);
  

  return (
    <>
        <StatusBar style="light" backgroundColor="#1f2937" />
        <View key={data?._id} className="mb-4 px-6 space-x-2">
          {/* <Text className="text-lg font-bold text-white">{data?.name}</Text> */}
          <View className="flex flex-row ">
            <Ionicons name="business-outline" size={18} color={"#fdb714"} />
            <Text className="text-gray-200 text-lg ms-2">{data?.company}</Text>
          </View>
          <View className="flex flex-row ">
            <Ionicons name="phone-portrait-sharp" size={18} color={"#fdb714"} />
            <Text className="text-gray-200 text-[18px] ms-2">
              {data?.phone}
            </Text>
          </View>
          <View className="flex flex-row ">
            <Ionicons name="location-outline" size={16} color={"#fdb714"} />
            <Text className="text-gray-400  p-1 ms-2">{data?.address}</Text>
          </View>
        </View>

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
            </Text>
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


      // balance section 
        <View className="flex flex-row justify-between items-center mt-4 w-[400px] mx-auto ">
          <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
            <Text className="text-white text-xl ">Starting balance</Text>
            <Text className="text-primary font-bold text-center text-xl">
              {data?.balance} <Text className="text-white">BDT</Text>
            </Text>
          </View>
          <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
            <Text className="text-white text-xl">Current balance</Text>
            <Text className="text-primary font-bold text-xl text-center">
             {currentBalance}<Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>




        //due sale flatlist 


        {/* <FlatList
      data={saledata}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#1f2937",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>
            Date: {item.date}
          </Text>
          <Text style={{ color: "#fdb714", fontSize: 18, fontWeight: "bold" }}>
            New Sale: {item.newSale.toLocaleString()} BDT
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20, color: "#aaa" }}>
          No data available
        </Text>
      }
    /> */}


        Due sell generat part
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Due Sale</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg -2">
              {formattedDate.day}
              <Text className="text-primary text-lg m-2">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Due Sale</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Due Sale</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>

        Recived payment recived generat part

        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
            12345<Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
            12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
            12345<Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>

         {/* Transactions */}
      {dayTransactions.map((t, index) => (
        <View key={index} className="bg-black p-4 rounded-lg mt-4 mx-4 h-20 flex justify-between">
          <Text className="text-white text-xl">{t.type === "sale" ? "Due Sale" : "Received Payment"}</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg">
              {formattedDate.day} <Text className="text-primary">{formattedDate.month}</Text> {formattedDate.year}
            </Text>
            <Text className="text-primary font-bold">
              {t.amount} <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
      ))}
    </>
  );
};

export default CustomerDetails;
