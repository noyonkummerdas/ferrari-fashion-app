import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const CashDepositDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();

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
      title: "Create Deposit",
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

  const cashDeposit = [
    {
      id: 1,
      companyName: "Incepta Pharmaceuticals Ltd.",
      amount: 25000,
      date: "2025-08-15",
      paymentMethod: "Cash",
      referenceNo: "CD-1001",
      memoNumber: 1234567,
    },
    {
      id: 2,
      companyName: "Square Pharmaceuticals Ltd.",
      amount: 18000,
      date: "2025-08-16",
      paymentMethod: "Bank Transfer",
      referenceNo: "CD-1002",
      memoNumber: 1234567,
    },
    {
      id: 3,
      companyName: "Beximco Pharmaceuticals Ltd.",
      amount: 32000,
      date: "2025-08-16",
      paymentMethod: "Cheque",
      referenceNo: "CD-1003",
      memoNumber: 1234567,
    },
    {
      id: 4,
      companyName: "Renata Ltd.",
      amount: 15000,
      date: "2025-08-17",
      paymentMethod: "Cash",
      referenceNo: "CD-1004",
      memoNumber: 1234567,
    },
    {
      id: 5,
      companyName: "ACI Limited",
      amount: 22000,
      date: "2025-08-18",
      paymentMethod: "Mobile Banking",
      referenceNo: "CD-1005",
      memoNumber: 1234567,
    },
  ];

  return (
    <>
      <ScrollView
        className="flex-1 bg-black-700 p-4"
        showsVerticalScrollIndicator={false}
      >
        <View>
          {cashDeposit.map((diposit, index) => (
            <>
              <View className="flex flex-row justify-between m-2 items-center border border-rounded bg-black-200 p-4 rounded-full">
                <View>
                  <Text className="text-primary text-lg">
                    {diposit.companyName}
                  </Text>
                  <Text className="text-gray-200">
                    {" "}
                    Memo:{diposit.memoNumber}
                  </Text>
                </View>
                <View className="flex flex-col justify-end items-end">
                  <Text className="text-gray-200">{diposit.date}</Text>
                  <Text className="text-gray-200">{diposit.amount}</Text>
                </View>
              </View>
            </>
          ))}
        </View>
        <TouchableOpacity
          className="items-center p-4 bg-primary rounded-lg mt-4"
          onPress={() => router.push("/account/cashDeposit/Id")}
        >
          <Text className="text-gray-200 font-bold text-lg">
            Update Diposti
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default CashDepositDetails;
