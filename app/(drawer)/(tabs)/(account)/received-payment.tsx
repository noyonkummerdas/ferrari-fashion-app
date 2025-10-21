import CustomDropdownWithSearch from "@/components/CustomDropdownWithSearch";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  useCustomerListQuery,
  useCustomerQuery,
  useGetCustomerByInvoiceQuery,
} from "@/store/api/customerApi";
import { useAddTransactionMutation } from "@/store/api/transactionApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const RecivedPayment = () => {
  const { userInfo } = useGlobalContext();
  const router = useRouter();
  const navigation = useNavigation();

  const [createTransaction] = useAddTransactionMutation();

  const [q, setQ] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [search, setSearch] = useState("");

  // Customer dropdown state
  const [type, setType] = useState([{ label: "Select Customer", value: "" }]);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: '',
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

  // Customer list for dropdown
  const { data: customerList, isSuccess, refetch } = useCustomerListQuery({
    q: q,
  });


  useEffect(() => {
    refetch();
  }, [q]);

  useEffect(() => {
    if (customerList && isSuccess) {
      const options = customerList.map((item) => ({
        label: item.name,
        value: item._id || item.id,
      }));
      setType(options);
    }
  }, [customerList, isSuccess]);

  // Get invoice data
  const {
    data: invoiceData,
    isSuccess: invoiceSuccess,
    refetch: invoiceRefetch,
  } = useGetCustomerByInvoiceQuery(
    { invoiceId: search },
    { skip: !search }
  );

  useEffect(() => {
    if (search) invoiceRefetch();
  }, [search]);

  // Update customerId when invoiceData changes
  useEffect(() => {
    if (invoiceData && invoiceSuccess) {
      handleInputChange("customerId", invoiceData.customerId);
      handleInputChange("amount", invoiceData.amount);
    } else {
      handleInputChange("customerId", "");
    }
  }, [invoiceData, invoiceSuccess]);

  // Get customer data to update openingBalance and currentBalance
  const { data: customerData, isSuccess: customerIsSuccess, error : customerError } =
    useCustomerQuery(formData.customerId);
    // console.log('Custoemr Data ', customerData, customerIsSuccess,  customerError)

  useEffect(() => {
    if (customerData && customerIsSuccess) {
      setFormData((prev) => ({
        ...prev,
        openingBalance: customerData.balance ?? 0,
        currentBalance: customerData.balance ?? 0,
        amount: customerData.balance ?? 0, // Auto-fill amount
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        openingBalance: 0,
        currentBalance: 0,
        amount: 0,
      }));
    }
  }, [customerData, customerIsSuccess]);

  const handleDatePress = () => setShowDatePicker(true);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
      if (Platform.OS === "android") setShowDatePicker(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "amount") {
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
        currentBalance:
          customerData?.balance != null ? customerData.balance - numValue : -numValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await createTransaction(formData).unwrap();
      console.log("Transaction created:", response);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
    router.back();
  };

  // Format date for display
  const formattedDateString = `${formData.date.getDate()} ${formData.date.toLocaleString(
    "en-US",
    { month: "long" }
  )}, ${formData.date.getFullYear()}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Received Payment",
      headerStyle: { backgroundColor: "#000" },
      headerTintColor: "#fff",
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1 bg-dark">
        <StatusBar style="light" />
        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 300 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Dropdown */}
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
              searchPlaceholder="Search customers..."
            />
          </View>

          {/* Date */}
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

          {/* Invoice */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Invoice</Text>
            <TextInput
              className="border border-black-200 bg-black-200 rounded-lg p-4 text-lg text-white"
              value={formData.invoice}
              onChangeText={(value) => {
                handleInputChange("invoice", value);
                setSearch(value);
              }}
              placeholder="Enter invoice"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Amount */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Amount</Text>
            <TextInput
              className="border border-black-200 bg-black-200 rounded-lg p-4 text-lg text-white"
              value={formData.amount.toString()}
              onChangeText={(value) => handleInputChange("amount", value)}
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Note */}
          <View className="mb-4">
            <Text className="text-gray-300 text-lg font-medium">Note</Text>
            <TextInput
              multiline
              numberOfLines={4}
              className="border border-black-200 bg-black-200 rounded-lg p-4 text-base text-white min-h-[120px]"
              value={formData.note}
              onChangeText={(value) => handleInputChange("note", value)}
              placeholder="Enter transaction note..."
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          {/* Submit */}
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

        {/* Date Picker */}
        {showDatePicker && (
          <View className="absolute inset-0 bg-black/70 justify-center items-center z-50">
            <View className="bg-gray-900 rounded-2xl p-6 w-full border border-gray-700 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-xl font-bold">Select Date</Text>
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
    </KeyboardAvoidingView>
  );
};

export default RecivedPayment;
