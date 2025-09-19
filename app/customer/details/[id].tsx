import { useGlobalContext } from "@/context/GlobalProvider";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { } from "react-native";
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
    const [paymentList, setPaymentList] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentDay, setCurrentDay] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const { userInfo, fetchUser } = useGlobalContext();
   const type = userInfo?.type;

  const { data, isLoading, error, refetch, isSuccess } = useGetCustomerByIdQuery({ 
    id, 
    date:format(currentDay, "MM-dd-yyyy")
   });

  useEffect(() => {
    refetch();
  }, [id,currentDay]);
  useEffect(() => {
    if (data?.transactions && Array.isArray(data.transactions)) {
      setPaymentList(data.transactions);
    }
  }, [data, isSuccess]);
  const dayTransactions = paymentList.filter(
    t => t.date === format(currentDay, "yyyy-MM-dd")
  );

  // console.log("DATA=>",data)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${data?.customer?.name || "Customer Details"}`,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
        <StatusBar style="light" backgroundColor="#1f2937" />
        <View key={data?.customer?._id} className="mb-4 px-6 space-x-2">
          {/* <Text className="text-lg font-bold text-white">{data?.customer?.name}</Text> */}
          <View className="flex flex-row ">
            <Ionicons name="business-outline" size={18} color={"#fdb714"} />
            <Text className="text-gray-200 text-lg ms-2">{data?.customer?.company}</Text>
          </View>
          <View className="flex flex-row ">
            <Ionicons name="phone-portrait-sharp" size={18} color={"#fdb714"} />
            <Text className="text-gray-200 text-[18px] ms-2">
              {data?.customer?.phone}
            </Text>
          </View>
          <View className="flex flex-row ">
            <Ionicons name="location-outline" size={16} color={"#fdb714"} />
            <Text className="text-gray-400  p-1 ms-2">{data?.customer?.address}</Text>
          </View>
        </View>

        {/* calendar */}
        <View className="mt-2 m-2">
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


      {/* balance section */}
        <View className="flex flex-row justify-between items-center m-2  mx-auto ">
          <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
            <Text className="text-white text-xl ">Starting balance</Text>
            <Text className="text-primary font-bold text-center text-xl">
              {data?.customer?.balance} <Text className="text-white">BDT</Text>
            </Text>
          </View>
          <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
            <Text className="text-white text-xl">Current balance</Text>
            <Text className="text-primary font-bold text-xl text-center">
             {data?.customer?.currentBalance}<Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>

      {/* Due sell generat part */}
      {data?.transaction?.map((item:any) => (
        <View key={item?._id} className="bg-black-200 flex justify-between p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">{item?.type}</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-md -2">
              {format(new Date(item?.createdAt), "dd MMM yyyy, h:mm a")}</Text>
            <Text className="text-primary text-lg font-bold">
              {item?.amount} <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
      ))}
      </KeyboardAvoidingView> 
    </>
  );
};

export default CustomerDetails;
