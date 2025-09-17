import { CustomDrawerToggleButton } from "@/components";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAllSaleQuery } from "@/store/api/saleApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Modal, Platform, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

const SalesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDay, setCurrentDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();
  const [tempDate, setTempDate] = useState(new Date());
  
  const type = userInfo?.type

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="mr-4 bg-gray-900">
          <TouchableOpacity
           onPress={() => router.push('/sales/createDueSelas')}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="cart-outline" size={20} color="#ffffff" />
            <Text className="text-white text-xl font-medium">Add</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "Sales",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
    });
  }, [navigation]);

  // // API call - only if userInfo exists
  const { data, isSuccess, isError, refetch } = useAllSaleQuery({ warehouse: userInfo?.warehouse as string, startDate: format(currentDay, "MM-dd-yyyy"), });

  // console.log(currentDay)
  useEffect(()=>{
    refetch()
  },[userInfo?.warehouse])

  // console.log(data)


  const [saleList, setSaleList] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setSaleList(data);
      } else if (
        data &&
        typeof data === "object" &&
        "transactions" in data &&
        Array.isArray((data as any).transactions)
      ) {
        setSaleList((data as any).transactions);
      } else {
        setSaleList([]);
      }
    }
  }, [data, isSuccess]);

  const [search, setSearch] = useState("");
  const filteredList =saleList.filter(
    (item) =>
      item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.amount?.toString()?.includes(search) ||
      item?.date?.includes(search),
  );

  const formattedDate = {
    day: currentDay.getDate(),
    month: currentDay.toLocaleString("en-US", { month: "long" }), // e.g. August
    year: currentDay.getFullYear(),
  };

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


  return (
    <>
    <View className="flex-1 bg-dark">

            {/* calendar */}
            <View className="mt-2 mb-2">
        <View className="flex flex-row justify-between items-center bg-black-200  p-2 rounded-lg mx-4">
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

      {/* Search Bar */}
      <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
        <TextInput
          placeholder="Search Customer"
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-300"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search-outline" size={24} color="gray" />
      </View>

{data?.length > 0 ?

      (<FlatList
        data={data}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="ml-4 mr-4 mt-4"
            activeOpacity={0.6}
            onPress={() => router.push(`/sales/${item._id}`)}

          >
            <View className="flex-row justify-between p-4 bg-black-200 rounded-lg items-center">
              <View className="flex-col">
                <Text className="text-primary font-bold text-lg">
                  {item?.customerName || "Unknown"}
                </Text>
                <Text className="text-gray-200 text-base">
                  {new Date(item?.formatedDate).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-col items-end">
                <Text className="text-gray-300 text-base">INV: {item?.invoice}</Text>
                <Text>
                  <Text className="text-primary">{item?.amount}</Text>
                  <Text className="text-gray-200"> BDT</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        />)
        : 
          <View className="flex-1 h-96 w-full justify-center items-center mt-10">
            <Ionicons name="cart-outline" size={60} color="gray" />
            <Text className="text-primary text-lg mt-4">No sales found</Text>
            <Text className="text-white text-sm">Try selecting another warehouse</Text>
          </View>

}
    </View>

<StatusBar style="light" />
</>
  );
};

export default SalesList;
