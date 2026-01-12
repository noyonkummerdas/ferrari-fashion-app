import Photo from "@/assets/images/Invoice.jpg";
import CustomDropdownWithSearch from "@/components/CustomDropdownWithSearch";
import PhotoUploader from "@/components/PhotoUploader";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAddPurchaseMutation } from "@/store/api/purchasApi";
import { useSupplierByIdQuery, useSupplierQuery, useSuppliersQuery, useUpdateSupplierMutation } from "@/store/api/supplierApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

const createPurchase = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
   const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [supplier, setSupplier] = useState([{ label: "Select Supplier", value: "" }]);
  const { userInfo } = useGlobalContext();
  // const type = userInfo?.type

  // const [createTransaction] = useAddTransactionMutation();
  // const [supplier, setSupplier] = useState("");

  const [q, setQ] = useState("all");
  const [sid, setSid] = useState("");
  const { data, isSuccess, isLoading, refetch } = useSuppliersQuery({
    q: q,
  });
  // console.log("SUPPLIER LIST DATA in create purchase:", data);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: 0,
    // note: "",
    photo: null as string | null,
    supplierId: "",
    invoiceId: "",
    name: "",
    note: "",
    type: "purchase",
    user: userInfo?.id,
    warehouse: userInfo?.warehouse,
    status: "complete",
  });
  console.log('formdata : ', formData)

  const {
    data: supplierData,
    isSuccess: supplierIsSuccess,
    refetch: supplierRefetch,
  } = useSuppliersQuery(formData.supplierId);

  

  const {
    data: supplierDataById,
    isSuccess: supplierIsSuccessById,
    refetch: supplierRefetchById,
  } = useSupplierQuery({ _id: formData.supplierId, date: new Date().toISOString(), isDate: "false" });

  // console.log('supplierDataById', supplierDataById, supplierIsSuccessById, formData.supplierId);

  // console.log('supplierData', supplierData, supplierIsSuccess, formData.supplierId);


  const {data: supplierByIdData, isSuccess: supplierByIdIsSuccess} = useSupplierByIdQuery({ _id:sid });

  // console.log('supplierByIdData', supplierByIdData, supplierByIdIsSuccess, sid);
  
  
  useEffect(() => {
    if (supplierData && supplierIsSuccess) {
      setFormData((prev) => ({
        ...prev,
        openingBalance: supplierData?.balance ?? 0,
        currentBalance: supplierData?.balance ?? 0,
      }));
    }
  }, [supplierData, supplierIsSuccess]);



  useEffect(() => {
    supplierRefetchById();
  }, [sid]);

  useEffect(() => {
    refetch();
  }, [q]);
  useEffect(() => {
    if (data && isSuccess) {
      const supplierOptions = data.map((item) => ({
        label: item.name,
        value: item._id || item.id,
      }));
      setSupplier(supplierOptions);
    }
  }, [data, isSuccess]);

  // date formatting
  const today = new Date();
  const formattedDate = {
    day: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }),
    year: today.getFullYear(),
  };
  const formattedDateString =`${formattedDate.day} ${formattedDate.month}, ${formattedDate.year}`;
;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
      title: "Create Purchase",
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
    if (field === "amount") {
      // Convert string to number for numeric fields
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
        currentBalance: data?.currentBalance
          ? parseInt(data?.currentBalance) - numValue
          : 0 - numValue,
      }));
    } else {
      // Handle string fields normally
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDatePress = () => {
    // console.log("Opening date picker");
    setShowDatePicker(true);
  };

  const handleTypeChange = (
    type: "income" | "expense" | "payment" | "receipt",
  ) => {
    setFormData((prev) => ({ ...prev, type }));
  };

   
  const [createPurchase]= useAddPurchaseMutation()
  
  const [updateSupplier] = useUpdateSupplierMutation();

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        poId: formData.invoiceId, // যদি backend poId expect করে
        currentBalance: formData.amount + (supplierByIdData?.balance || 0),
      };
      const response = await createPurchase(payload).unwrap();
      if (response) {
        const udateSupplierBlance = await updateSupplier({
          _id: formData.supplierId,
          balance: formData.amount + (supplierByIdData?.balance || 0),
        });
        if (udateSupplierBlance) {
          console.log("Success", "Payment created successfully", udateSupplierBlance);
        }
      }
      refetch();
      router.back();
      console.log("Purchase created:", response);
    } catch (error) {
      console.error("Error creating Purchase:", error);
    }
  };
  

  const handlePhotoUpload = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload photos.",
          [{ text: "OK" }],
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setFormData((prev) => ({ ...prev, photo: selectedImage.uri }));
        console.log("Photo selected:", selectedImage.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos.",
          [{ text: "OK" }],
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const capturedImage = result.assets[0];
        setFormData((prev) => ({ ...prev, photo: capturedImage.uri }));
        console.log("Photo captured:", capturedImage.uri);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image. Please try again.", [
        { text: "OK" },
      ]);
    }
  };
  const handleDateChange = (
  event: any,
  selectedDate?: Date
) => {
  // Android এ cancel করলে
  if (Platform.OS === "android") {
    setShowDatePicker(false);
  }

  if (event?.type === "dismissed") {
    return;
  }

  if (selectedDate) {
    setFormData((prev) => ({
      ...prev,
      date: selectedDate,
    }));
  }
};


  const showPhotoOptions = () => {
    Alert.alert("Photo Upload", "Choose how you want to add a photo", [
      {
        text: "Camera",
        onPress: handleCameraCapture,
      },
      {
        text: "Gallery",
        onPress: handlePhotoUpload,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  return (
    <>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView 
       className="flex-1 pt-4"
           contentContainerStyle={{ paddingBottom: 300 }}
           keyboardShouldPersistTaps="handled"
           showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-dark">
          <StatusBar style="light" />
          <ScrollView
            className="flex-1 px-6 pt-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Supplier Input */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg font-medium">
                Supplier
              </Text>
              <CustomDropdownWithSearch
                data={supplier}
                value={formData.supplierId}
                placeholder="Select Supplier"
                onValueChange={(value: string) =>{
                  handleInputChange("supplierId", value)
                  setSid(value)}
                
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
                <Text className="text-white text-lg">
                  {formattedDateString}
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
                value={formData.invoiceId.toString()}
                onChangeText={(value) => handleInputChange("invoiceId", value)}
                placeholder="Enter invoice"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Photo Upload */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg font-medium">
                Invoice Photo
              </Text>
              <PhotoUploader
                placeholder={Photo}
                onUploadSuccess={(url)=>handleInputChange("photo", url)}
                previewStyle={"square"}
                aspectRatio={[9,19]}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="w-full bg-primary p-4 rounded-lg mt-4 mb-8"
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text className="text-black text-center font-bold text-lg">
                Purchase
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
      <StatusBar style="light" />
      </KeyboardAvoidingView>
      
      </>
  );
};

export default createPurchase;
