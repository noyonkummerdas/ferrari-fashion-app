import CustomDropdownWithSearch from "@/components/CustomDropdownWithSearch";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  useCustomerListQuery,
  useCustomerQuery,
} from "@/store/api/customerApi";
import { useAddTransactionMutation } from "@/store/api/transactionApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";

const RecivedPayment = () => {
  const { userInfo } = useGlobalContext();
  const [createTransaction] = useAddTransactionMutation();
  const [q, setQ] = useState("all");
  const { data, isSuccess, isLoading, refetch } = useCustomerListQuery({
    q: q,
  });

  useEffect(() => {
    refetch();
  }, [q]);

  // console.log("q, data", q, data);

  useEffect(() => {
    if (data && isSuccess) {
      const customerOptions = data.map((item) => ({
        label: item.name,
        value: item._id || item.id,
      }));
      setType(customerOptions);
    }
  }, [data, isSuccess]);

  const router = useRouter();
  const navigation = useNavigation();

  const [type, setType] = useState([{ label: "Select Customer", value: "" }]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: 0,
    note: "",
    name: "",
    customerId: "",
    invoice: "",
    photo: null as string | null,
    type: "paymentReceived",
    user: userInfo?.id,
    warehouse: userInfo?.warehouse,
    openingBalance: 0,
    currentBalance: 0,
    invoices: "",
    status: "complete",
  });

  const {
    data: customerData,
    isSuccess: customerIsSuccess,
    refetch: customerRefetch,
  } = useCustomerQuery(formData.customerId);

  useEffect(() => {
    if (customerData && customerIsSuccess) {
      setFormData((prev) => ({
        ...prev,
        openingBalance: customerData?.currentBalance ?? 0,
        currentBalance: customerData?.currentBalance ?? 0,
      }));
    }
  }, [customerData, customerIsSuccess]);

  useEffect(() => {
    customerRefetch();
  }, [formData.customerId]);

  const handleDatePress = () => {
    console.log("Opening date picker");
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log("Date picker event:", event);
    console.log("Selected date:", selectedDate);

    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
      console.log("Date updated to:", selectedDate);

      // Close picker after selection
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
    }
  };

  // date formatting
  const today = new Date();
  const formattedDate = {
    day: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }),
    year: today.getFullYear(),
  };
  const formattedDateString = `${formattedDate.day} ${formattedDate.month}, ${formattedDate.year}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Received Payment",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`,
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
    });
  }, [navigation]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "amount") {
      // Convert string to number for numeric fields
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
        currentBalance: customerData?.currentBalance
          ? parseInt(customerData?.currentBalance) - numValue
          : 0 - numValue,
      }));
    } else {
      // Handle string fields normally
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  console.log("formData", formData);

  const handleTypeChange = (
    type: "income" | "expense" | "payment" | "receipt",
  ) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleSubmit = async () => {
    console.log("Transaction Form Data:", formData);
    console.log("Photo URI:", formData.photo);

    try {
      const response = await createTransaction(formData).unwrap();
      console.log("Transaction created:", response);
    } catch (error) {
      // console.error("Error creating transaction:", error);
     
    }
    router.back()

    // Alert.alert(
    //   "Success",
    //   "Form data logged to console. Check console for details.",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         setFormData({
    //           name: "",
    //           user: userInfo?.id,
    //           warehouse: userInfo?.warehouse,
    //           amount: 0,
    //           openingBalance: 0,
    //           currentBalance: 0,
    //           photo: "",
    //           invoices: "",
    //           note: "",
    //           date: new Date(),
    //           type: "paymentReceived",
    //           status: "complete",
    //           // supplierId: "",
    //           invoice: "",
    //           customerId: "",
    //         });
    //         router.back();
    //       },
    //     },
    //   ],
    // );
  };

  return (
    <>
      <View className="flex-1 bg-dark">
        <StatusBar style="light" />
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Type Input */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Customer</Text>
            <CustomDropdownWithSearch
              data={type}
              value={formData.customerId}
              placeholder="Select Customer"
              onValueChange={(value: string) =>
                handleInputChange("customerId", value)
              }
              onSearchChange={(query: string) => setQ(query)}
              searchPlaceholder="Search suppliers..."
            />
          </View>
          {/* Date Input */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Date</Text>
            <TouchableOpacity
              className="border border-black-200 bg-black-200 rounded-lg p-4 flex-row justify-between items-center"
              onPress={handleDatePress}
              activeOpacity={0.7}
            >
              <Text className="text-white text-lg">{formattedDateString}</Text>
              <Ionicons name="calendar" size={24} color="#FDB714" />
            </TouchableOpacity>
          </View>
          {/* Invoice Input */}

          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Invoice</Text>
            <TextInput
              className="border  border-black-200 bg-black-200  rounded-lg p-4 text-lg text-white"
              value={formData.invoice}
              onChangeText={(value) => handleInputChange("invoice", value)}
              placeholder="Enter invoice"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Amount Input */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Amount</Text>
            <TextInput
              className="border  border-black-200 bg-black-200  rounded-lg p-4 text-lg text-white"
              value={formData.amount.toString()}
              onChangeText={(value) => handleInputChange("amount", value)}
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Note Input */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Note</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              className="border  border-black-200 bg-black-200  rounded-lg p-4 text-base text-white min-h-[120px]"
              value={formData.note}
              onChangeText={(value) => handleInputChange("note", value)}
              placeholder="Enter transaction note..."
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="w-full bg-primary p-4 rounded-lg mt-4 mb-8"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-black text-center font-bold text-lg">
              Received Payment
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <View className="absolute inset-0 bg-black/70 justify-center items-center z-50">
            <View className="bg-gray-900 rounded-2xl p-6 w-full border border-gray-700 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-xl font-bold">
                  Select Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="bg-gray-800 rounded-xl p-4 mb-6">
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(2020, 0, 1)}
                  textColor="#ffffff"
                  themeVariant="dark"
                />
              </View>

              {Platform.OS === "ios" && (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="w-52 bg-gray-700 p-4 rounded-xl border border-gray-600"
                    onPress={() => setShowDatePicker(false)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-300 text-center font-semibold text-lg">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-primary p-4 rounded-xl"
                    onPress={() => setShowDatePicker(false)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-black text-center font-bold text-lg">
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default RecivedPayment;
