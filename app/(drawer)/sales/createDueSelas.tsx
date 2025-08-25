import CustomDropdownWithSearch from "@/components/CustomDropdownWithSearch";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useCustomerListQuery, useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { useAddSaleMutation, useAllSaleQuery,} from "@/store/api/saleApi";
// import { useSuppliersQuery } from "@/store/api/supplierApi";
// import { useAddTransactionMutation } from "@/store/api/transactionApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const CreateDueSelas = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
   const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();
  const [q, setQ] = useState("all");
  const [customer, setCustomer] = useState([{ label: "Select Customer", value: "" }]);

  const { data, isSuccess, isLoading, refetch } = useCustomerListQuery({
    q: q,
  });

  useEffect(() => {
    refetch();
  }, [q])


  useEffect(() => {
    if (data && isSuccess) {
      const customerOptions = data.map((item) => ({
        label: item.name,
        value: item._id || item.id,
      }));
      setCustomer(customerOptions);
    }
  }, [data, isSuccess]);
  // Form state
  const [formData, setFormData] = useState({
    invoiceId:'',
    date: new Date(),
    amount: 0,
    note: "",
    customerId: "",
    invoice: "",
    name: "",
    // type: "due",
    user: userInfo?.id,
    warehouse: userInfo?.warehouse,
    invoices: "",
    status: "complete",

  });
  // console.log('saleData', data)

  // date formatting
  const today = new Date();
  const formattedDate = {
    day: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }),
    year: today.getFullYear(),
  };
  const formattedDateString =`${formattedDate.day} ${formattedDate.month}, ${formattedDate.year}`;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Sales",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
    });
  }, [navigation]);
 
  

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: field === "amount" ? parseInt(value) || 0 : value
      };
      return updated;
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
    setShowDatePicker(false);
  };
  
  

  const handleDatePress = () => {
    setShowDatePicker(true);
  };
  

  
  const [createSale] = useAddSaleMutation()

  const handleSubmit = async () => {
    console.log("sale Form Data:", formData);
    const sales = await createSale(formData);
    console.log("SALE RESPONSE",JSON.stringify(sales, null, 2));
  };

  // const handleSubmit = async () => {
  //   try {
  //     const payload = {
  //       ...formData,
  //       date: formData.date instanceof Date 
  //         ? formData.date.toISOString().split("T")[0] 
  //         : formData.date,
  //     };
  
  //     console.log("🚀 Final Sale Payload:", payload);
  
  //     const sales = await createSale(payload).unwrap();
  //     console.log("✅ SALE RESPONSE", sales);
  
  //     Alert.alert("Success", "Sale created successfully!");
  //     router.back();
  //   } catch (error) {
  //     console.log("❌ Sale API Error:", error);
  //     Alert.alert("Error", "Something went wrong!");
  //   }
  // };
  

  return (
    <>
      <ScrollView>
        <View className="flex-1 bg-dark">
          <StatusBar style="light" />
          <ScrollView
            className="flex-1 px-6 pt-4"
            showsVerticalScrollIndicator={false}
          >
         
         <View className="mb-4">
              <Text className="text-gray-300 text-lg font-medium">
                Customer
              </Text>
              <CustomDropdownWithSearch
                data={customer}
                value={formData?.customerId}
                placeholder="Select customer ...."
                onValueChange={(value: string) =>
                  handleInputChange("customerId", value)
                }
                onSearchChange={(query: string) => setQ(query)}
                searchPlaceholder="Search Customer..."
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
                <Text className="text-white text-lg">
                  {formattedDate.day}
                </Text>
                <Ionicons name="calendar" size={24} color="#FDB714" />
              </TouchableOpacity>
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

            {/* Memo No Input */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg font-medium">Invoice</Text>
              <TextInput
                className="border  border-black-200 bg-black-200  rounded-lg p-4 text-lg text-white"
                value={formData.invoice.toString()}
                onChangeText={(value) => handleInputChange("invoice", value)}
                placeholder="Enter invoice"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              className="w-full bg-primary p-4 rounded-lg mt-4 mb-8"
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text className="text-black text-center font-bold text-lg">
                Sales
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
      </ScrollView>
      </>
  );
};

export default CreateDueSelas;

