import { CustomDrawerToggleButton } from "@/components";
import { useGlobalContext } from "@/context/GlobalProvider";
import { usePurchasesDWQuery } from "@/store/api/purchasApi";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { format } from "date-fns";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Modal, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

const PurchasesList = () => {
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const { userInfo } = useGlobalContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const { data, isSuccess, refetch } = usePurchasesDWQuery({
    warehouse: userInfo?.warehouse,
    date: format(currentDate, "MM-dd-yyyy"),
    isDate: "month",
    q: searchQuery || "all",
    forceRefetch: true,
  });
  console.log("Purchases Data:", data);

  useEffect(() => {
    if (isFocused) refetch();
  }, [isFocused, currentDate, userInfo?.warehouse]);

  const formattedDate = {
    month: currentDate.toLocaleString("en-US", { month: "long" }),
    year: currentDate.getFullYear(),
  };

  const selectMonth = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowDatePicker(false);
  };

  const goToPreviousMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (nextMonth <= new Date()) setCurrentDate(nextMonth);
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="me-4 bg-dark">
          <TouchableOpacity
            onPress={() => router.push("/purchases/create-purchase")}
            className="flex flex-row justify-center items-center gap-2"
          >
            <Ionicons name="bag-add" size={20} color="#ffffff" />
            <Text className="text-white text-xl font-pmedium">Add</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "Purchases",
      headerStyle: { backgroundColor: `#000000` },
      headerTintColor: `#ffffff`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
    });
  }, [navigation]);

  // ===== Filter logic =====
  const filteredData = data?.filter(item => {
    const supplierName = item?.supplierName?.toLowerCase() ?? "";
    const invoice = item?.invoice?.toString() ?? "";
    const amount = item?.amount?.toString() ?? "";
    const query = searchQuery.toLowerCase();
    return supplierName.includes(query) || invoice.includes(query) || amount.includes(query);
  }) || [];

  return (
    <>
      {/* Calendar */}
      <View className="mt-2 mb-2">
        <View className="flex flex-row justify-between items-center bg-black-200 p-2 rounded-lg">
          <TouchableOpacity onPress={goToPreviousMonth} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex flex-row items-center px-4 rounded-lg"
          >
            <Text className="text-primary text-lg">{formattedDate.month}</Text>
            <Text className="text-white text-lg ml-2">{formattedDate.year}</Text>
            <Ionicons name="calendar-outline" size={20} color="#fdb714" className="ml-2" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextMonth}
            className={`p-2 ${currentDate >= new Date() ? "opacity-50" : ""}`}
            disabled={currentDate >= new Date()}
          >
            <Ionicons name="arrow-forward" size={24} color={currentDate >= new Date() ? "#666" : "white"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
        <TextInput
          placeholder="Search Supplier Invoice Amount"
          className="placeholder:text-gray-100 flex-1 text-gray-300"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search-outline" size={24} color={"gray"} />
      </View>

      {/* Purchases List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push(`/purchases/${item._id}`)}
          >
            <View className="flex-row justify-between p-4 bg-black-200 rounded-lg ms-4 me-4 mt-4 items-center">
              <View className="flex-col">
                <Text className="text-primary text-lg">{item?.supplierName}</Text>
                <Text className="text-gray-200">{item?.formatedDate}</Text>
              </View>

              <View className="flex-col items-end">
                <Text className="text-gray-200 text-md">INV: {item?.invoice}</Text>
                <Text className="text-primary">{item?.amount} <Text className="text-gray-200">BDT</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 h-96 w-full justify-center items-center mt-10">
            <Ionicons name="bag-outline" size={60} color="gray" />
            <Text className="text-primary text-lg mt-4">No purchases found</Text>
          </View>
        }
      />

      {/* Month/Year Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="bg-black-200 rounded-2xl p-6 mx-4 w-full">
            <Text className="text-white text-xl font-semibold mb-4">Select Month</Text>

            {/* Year Selector */}
            <View className="flex flex-row justify-between mb-4">
              <TouchableOpacity onPress={() => setCurrentDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-xl">{currentDate.getFullYear()}</Text>
              <TouchableOpacity onPress={() => setCurrentDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))}>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Months Grid */}
            <View className="flex flex-row flex-wrap justify-between">
              {months.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => selectMonth(i)}
                  className={`p-4 rounded-lg mb-2 w-[28%] ${currentDate.getMonth() === i ? "bg-primary" : "bg-black-300"}`}
                >
                  <Text className="text-white text-center">{m.slice(0, 3)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowDatePicker(false)}
              className="mt-4 p-3 rounded-lg bg-gray-600"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </>
  );
};

export default PurchasesList;
