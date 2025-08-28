import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Platform, StatusBar, TextInput, useColorScheme } from "react-native";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { usePurchasesDWQuery, usePurchaseSupplierQuery } from "@/store/api/purchasApi";
import { useGlobalContext } from "@/context/GlobalProvider";
import { addDays, format, isToday, subDays } from "date-fns";
const PurchasesList = () => {
     const colorScheme = useColorScheme();
     const { userInfo } = useGlobalContext();
     const [searchQuery, setSearchQuery] = useState("");

     const [currentDay, setCurrentDay] = useState(new Date());
     const [showDatePicker, setShowDatePicker] = useState(false);
     const [tempDate, setTempDate] = useState(new Date());



     const { data, isSuccess, isError, refetch } = usePurchasesDWQuery({ warehouse: userInfo?.warehouse, date: format(currentDay, "MM-dd-yyyy"), });
    //  console.log('data', data, isSuccess, isError)

     useEffect(()=>{
       refetch()
     },[userInfo?.warehouse])

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


  const [purcheseList, setPurcheseList] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setPurcheseList(data);
      } else if (
        data &&
        typeof data === "object" &&
        "transactions" in data &&
        Array.isArray((data as any).transactions)
      ) {
        setPurcheseList((data as any).transactions);
      } else {
        setPurcheseList([]);
      }
    }
  }, [data, isSuccess]);
     
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
          //@ts-ignore
          headerStyle: {
            backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
          },
          //@ts-ignore
          headerTintColor: `#ffffff`,
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerShown: true,
          headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
        });
      }, [navigation]);

  return (
    <>
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
    <View className="flex flex-row justify-between rounded-full h-14 items-center px-5 m-2 bg-black-200">
     <TextInput
       placeholder="Search Supplire"
       className="placeholder:text-gray-100 flex-1 text-gray-300 "
       value={searchQuery}
       onChangeText={setSearchQuery}
     />
     <Ionicons name="search-outline" size={24} color={"gray"} />
   </View>
    <FlatList
    data={data}                           // 
    keyExtractor={(item, index) => item._id || index.toString()}    // 
    renderItem={({ item }) => (
      <TouchableOpacity
      className=""
      activeOpacity={0.6} // lower = more fade
      onPress={() => router.push(`/purchases/${item._id}`)}

    >

      <View className="flex-row justify-between p-4 bg-black-200 rounded-lg ms-4 me-4 mt-4 items-center">
        <View className="flex-col">
        <View className="flex-row items-center">
        
            <View>
              <Text className="text-primary text-lg ">{item?.supplierName}</Text>
              <Text className="text-gray-200">{item?.formatedDate}</Text>
              
            </View>
        </View>
        </View>
        
        <View className="flex-col items-end">

        <Text className="text-gray-200 text-md"> INV: {item?.invoice}</Text>
          <Text className="text-primary ">{item?.amount} <Text className="text-gray-200">BDT</Text></Text>
        </View>
      </View>
      </TouchableOpacity>
    )}
  />
  </>
  );
};

export default PurchasesList;