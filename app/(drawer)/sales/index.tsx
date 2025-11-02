import { CustomDrawerToggleButton } from "@/components";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAllSaleQuery } from "@/store/api/saleApi";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
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

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="mr-4">
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
      headerStyle: { backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
    });
  }, [navigation]);

  const { data, isSuccess, refetch } = useAllSaleQuery({
    warehouse: userInfo?.warehouse as string,
    startDate: format(currentDay, "MM-dd-yyyy"),
    isDate: "month",
     forceRefetch: true,
  });

  useEffect(() => { refetch() }, [userInfo?.warehouse, currentDay]);

  const [saleList, setSaleList] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) setSaleList(data);
      else if ("transactions" in data && Array.isArray((data as any).transactions)) setSaleList((data as any).transactions);
      else setSaleList([]);
    }
  }, [data, isSuccess]);

  // ===== Fix: Search / Filter Logic =====
  const filteredList = saleList.filter(item => {
    const customerName = item?.customerName?.toLowerCase() ?? "";
    const amount = item?.amount?.toString() ?? "";
    const saleDate = item?.formatedDate 
      ? format(new Date(item.formatedDate), "yyyy-MM-dd") 
      : "";

    const query = searchQuery.toLowerCase();
    return (
      customerName.includes(query) ||
      amount.includes(query) ||
      saleDate.includes(query)
    );
  });

  const formattedDate = {
    month: currentDay.toLocaleString("en-US", { month: "long" }),
    year: currentDay.getFullYear(),
  };

  // Month navigation
  const goToPreviousMonth = () => setCurrentDay(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1);
    if (nextMonth <= new Date()) setCurrentDay(nextMonth);
  };

  const openDatePicker = () => { setTempDate(currentDay); setShowDatePicker(true); };
  const confirmDateSelection = () => { setCurrentDay(tempDate); setShowDatePicker(false); };
  const cancelDateSelection = () => { setTempDate(currentDay); setShowDatePicker(false); };
  const handleDateChange = (event: any, selectedDate?: Date) => { if (Platform.OS === "android") setShowDatePicker(false); if (selectedDate) setTempDate(selectedDate); };

  return (
    <>
      <View className="flex-1 bg-dark">

        {/* Calendar */}
        <View className="mt-2 mb-2">
          <View className="flex flex-row justify-between items-center bg-black-200 p-2 rounded-lg mx-4">
            <TouchableOpacity onPress={goToPreviousMonth} className="p-2">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openDatePicker}
              className="flex flex-row items-center px-4 rounded-lg"
            >
              <Text className="text-primary text-lg">{formattedDate.month}</Text>
              <Text className="text-white text-lg ml-2">{formattedDate.year}</Text>
              <Ionicons name="calendar-outline" size={20} color="#fdb714" className="ml-2" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToNextMonth}
              className={`p-2 ${currentDay >= new Date() ? "opacity-50" : ""}`}
              disabled={currentDay >= new Date()}
            >
              <Ionicons name="arrow-forward" size={24} color={currentDay >= new Date() ? "#666" : "white"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker Modal */}
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View className="flex-1 bg-black/70 justify-center items-center">
            <View className="bg-black-200 rounded-2xl p-6 mx-4 w-full">
              <Text className="text-white text-xl font-semibold mb-4">Select Month</Text>

              {/* Year Selector */}
              <View className="flex flex-row justify-between mb-4">
                <TouchableOpacity onPress={() => setCurrentDay(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl">{currentDay.getFullYear()}</Text>
                <TouchableOpacity onPress={() => setCurrentDay(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))}>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Months Grid */}
              <View className="flex flex-row flex-wrap justify-between">
                {months.map((m, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { setCurrentDay(new Date(currentDay.getFullYear(), i, 1)); setShowDatePicker(false); }}
                    className={`p-4 rounded-lg mb-2 w-[28%] ${currentDay.getMonth() === i ? "bg-primary" : "bg-black-300"}`}
                  >
                    <Text className="text-white text-center">{m.slice(0,3)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={cancelDateSelection}
                className="mt-4 p-3 rounded-lg bg-gray-600"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Search Bar */}
        <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
          <TextInput
            placeholder="Search Customer / Amount / Date"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-gray-300"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={24} color="gray" />
        </View>

        {filteredList?.length > 0 ?
          (<FlatList
            data={filteredList}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="ml-4 mr-4 mt-4"
                activeOpacity={0.6}
                onPress={() => router.push(`/sales/${item._id}`)}
              >
                <View className="flex-row justify-between p-4 bg-black-200 rounded-lg items-center">
                  <View className="flex-col">
                    <Text className="text-primary font-bold text-lg">{item?.customerName || "Unknown"}</Text>
                    <Text className="text-gray-200 text-base">{new Date(item?.formatedDate).toLocaleDateString()}</Text>
                  </View>
                  <View className="flex-col items-end">
                    <Text className="text-gray-300 text-base">INV: {item?.invoice}</Text>
                    <Text><Text className="text-primary">{item?.amount}</Text><Text className="text-gray-200"> BDT</Text></Text>
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
