import { useSupplierQuery } from "@/store/api/supplierApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState, } from "react";
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";


const SupplierDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [currentDay, setCurrentDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [supplireDetails, setSupplirDetails] =  useState<any[]>([]);

  const { data, isLoading, error, refetch } = useSupplierQuery({ _id: id, date:currentDay });

  // console.log("DATA::", id, data);

  useEffect(() => {
    refetch();
  }, [id, currentDay]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${data?.supplier?.name || "Supplier Details"}`,
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
          onPress={() => router.push(`/supplier/${Array.isArray(id) ? id[0] : id}`)}
          className="flex flex-row items-center gap-2"
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
          <Text className="text-white text-lg">Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);


   //date formatting
   const formattedDate = {
    day: currentDay.getDate(),
    month: currentDay.toLocaleString("en-US", { month: "long" }), 
    year: currentDay.getFullYear(),
  };

  const [search, setSearch] = useState("");
  const filteredList = supplireDetails.filter(
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

  // console.log(data)

  return (
    <>
      <ScrollView>
        <View className=" px-4 py-4 space-y-2">
          {/* {data.map((customer) => ( */}
          <View key={data?.supplier?._id} className="mb-4">
            {/* <Text className="text-lg font-bold text-white">{data?.supplier?.name}</Text> */}
            <View className="flex flex-row ">
              <Ionicons name="business-outline" size={18} color={"#fdb714"} />
              <Text className="text-gray-200 text-lg ms-2">
                {data?.supplier?.company}
              </Text>
            </View>
            <View className="flex flex-row ">
              <Ionicons
                name="phone-portrait-sharp"
                size={18}
                color={"#fdb714"}
              />
              <Text className="text-gray-200 text-[18px] ms-2">
                {data?.supplier?.phone}
              </Text>
            </View>
            <View className="flex flex-row ">
              <Ionicons name="location-outline" size={16} color={"#fdb714"} />
              <Text className="text-gray-400  p-1 ms-2">{data?.supplier?.address}</Text>
            </View>
          </View>
        </View>

      

        {/* calendar */}
        <View className="m-2 p-2 flex-1">
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
        <View className="flex-1 bg-black/70 justify-center items-center m-2">
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

        <View className="flex-1 flex-row justify-between items-center mt-4 mx-auto  ">
          <View className="flex bg-black-200 item-center justify-evely p-5 text-center rounded-lg me-1">
            <Text className="text-white text-xl p-3 ">Starting balance</Text>
            <Text className="text-primary font-bold text-center text-xl">
              {data?.supplier?.balance} <Text className="text-white">BDT</Text>
            </Text>
          </View>
          <View className="flex bg-black-200 item-center justify-center p-5 text-center rounded-lg ms-1">
            <Text className="text-white p-3 text-xl">Current balance</Text>
            <Text className="text-primary font-bold text-xl text-center">
              {data?.supplier?.currentBalance} <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>

        {/* Due sell generat part */}
       {data?.transaction?.map((item:any) => (
        <View key={item?._id} className="bg-black-200 flex justify-between p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">{item?.type}</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-md me-2">
              {format(new Date(item?.createdAt), "dd MMM yyyy, h:mm a")}
            </Text>
            <Text className="text-primary text-lg font-bold">
              {item?.amount} <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
       ))}
      </ScrollView>
    </>
  );
};

export default SupplierDetails;
