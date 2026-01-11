import photo from "@/assets/images/Invoice.jpg";
import CustomDropdownWithSearch from "@/components/CustomDropdownWithSearch";
import PhotoUploader from "@/components/PhotoUploader";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useSuppliersQuery } from "@/store/api/supplierApi";
import { useAddTransactionMutation } from "@/store/api/transactionApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  View,
} from "react-native";

const Payment = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { userInfo } = useGlobalContext();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [search, setSearch] = useState("all");

  const { data: suppliers = [], refetch } = useSuppliersQuery({ q: search });
  const [createTransaction] = useAddTransactionMutation();

  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [formData, setFormData] = useState({
    date: new Date(),
    supplierId: "",
    amount: 0,
    openingBalance: 0,
    currentBalance: 0,
    note: "",
    invoices: "",
    photo: null as string | null,
    type: "payment",
    user: userInfo?.id,
    warehouse: userInfo?.warehouse,
    status: "complete",
  });

  /* ---------------- Navigation ---------------- */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Payment",
      headerStyle: { backgroundColor: "#000" },
      headerTintColor: "#fff",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, []);

  /* ---------------- Suppliers ---------------- */
  useEffect(() => {
    refetch();
  }, [search]);

  useEffect(() => {
    const options = suppliers.map((s) => ({
      label: s.name,
      value: s._id || s.id,
    }));
    setSupplierOptions(options);
  }, [suppliers]);

  /* ---------------- Handlers ---------------- */
  const handleSupplierSelect = (supplierId: string) => {
    const supplier = suppliers.find(
      (s) => s._id === supplierId || s.id === supplierId
    );

    const balance = supplier?.balance ?? 0;

    setFormData((prev) => ({
      ...prev,
      supplierId,
      amount: 0,
      openingBalance: balance,
      currentBalance: balance,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "amount") {
      const amount = Number(value) || 0;
      setFormData((prev) => ({
        ...prev,
        amount,
        currentBalance: prev.openingBalance - amount,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await createTransaction(formData).unwrap();
      router.back();
    } catch {
      Alert.alert("Error", "Failed to create payment");
    }
  };

  /* ---------------- Date ---------------- */
  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString("en-US", {
    month: "long",
  })}, ${today.getFullYear()}`;

  /* ---------------- UI ---------------- */
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 bg-dark">
            <StatusBar style="light" />

            {/* Supplier */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-300 text-lg">Supplier</Text>
                <Text className="text-gray-300">
                  Balance: {formData.currentBalance}
                </Text>
              </View>

              <CustomDropdownWithSearch
                data={supplierOptions}
                value={formData.supplierId}
                placeholder="Select Supplier"
                onValueChange={handleSupplierSelect}
                onSearchChange={(q) => setSearch(q)}
              />
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg">Date</Text>
              <TouchableOpacity
                className="bg-black-200 p-4 rounded-lg flex-row justify-between"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className="text-white">{formattedDate}</Text>
                <Ionicons name="calendar" size={22} color="#FDB714" />
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg">Amount</Text>
              <TextInput
                className="bg-black-200 p-4 rounded-lg text-white"
                keyboardType="numeric"
                value={String(formData.amount)}
                onChangeText={(v) => handleInputChange("amount", v)}
              />
            </View>

            {/* Note */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg">Note</Text>
              <TextInput
                multiline
                className="bg-black-200 p-4 rounded-lg text-white min-h-[100px]"
                value={formData.note}
                onChangeText={(v) => handleInputChange("note", v)}
              />
            </View>

            {/* Photo */}
            <View className="mb-4">
              <Text className="text-gray-300 text-lg">Invoice Photo</Text>
              <PhotoUploader
                placeholder={photo}
                onUploadSuccess={(url) =>
                  setFormData((p) => ({ ...p, photo: url }))
                }
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              className="bg-primary p-4 rounded-lg mt-6"
              onPress={handleSubmit}
            >
              <Text className="text-black text-center font-bold text-lg">
                Payment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          onChange={(_, d) =>
            setFormData((p) => ({ ...p, date: d || p.date }))
          }
        />
      )}
    </>
  );
};

export default Payment;
