import { useGetCustomerByIdQuery } from "@/store/api/customerApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const CustomerDetails = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // console.log(id)

  const { data, isLoading, error, refetch } = useGetCustomerByIdQuery({ id });
  // console.log(data);

  useEffect(() => {
    refetch();
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${data?.name || "Customer Details"}`,
      //@ts-ignore
      headerStyle: {
        backgroundColor: `#000000`, //`${Colors[colorScheme ?? "dark"].backgroundColor}`,
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
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push(`/customer/${id}`)}
          className="flex flex-row items-center gap-2"
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
          <Text className="text-white text-lg">Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, data]);

  //date formatting
  const today = new Date();
  const formattedDate = {
    day: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }), // e.g. August
    year: today.getFullYear(),
  };

  return (
    <>
      <ScrollView className="bg-dark">
        <StatusBar style="light" backgroundColor="#1f2937" />
        <View key={data?._id} className="mb-4 px-6 space-x-2">
          {/* <Text className="text-lg font-bold text-white">{data?.name}</Text> */}
          <View className="flex flex-row ">
            <Ionicons name="business-outline" size={18} color={"#fdb714"} />
            <Text className="text-gray-200 text-lg ms-2">{data?.company}</Text>
          </View>
          <View className="flex flex-row ">
            <Ionicons name="phone-portrait-sharp" size={18} color={"#fdb714"} />
            <Text className="text-gray-200 text-[18px] ms-2">
              {data?.phone}
            </Text>
          </View>
          <View className="flex flex-row ">
            <Ionicons name="location-outline" size={16} color={"#fdb714"} />
            <Text className="text-gray-400  p-1 ms-2">{data?.address}</Text>
          </View>
        </View>

        {/* calendar */}

        <View className="flex flex-row justify-between items-center bg-black-200  p-3 rounded-lg">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className=" flex flex-row item-center bg-black-200">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
          </View>

          <TouchableOpacity>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-center mt-4 w-[400px] mx-auto ">
          <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
            <Text className="text-white text-xl ">Starting balance</Text>
            <Text className="text-primary font-bold text-center text-xl">
              234234 <Text className="text-white">BDT</Text>
            </Text>
          </View>
          <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg m-1">
            <Text className="text-white text-xl">Current balance</Text>
            <Text className="text-primary font-bold text-xl text-center">
              38234 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>

        {/* Due sell generat part */}
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Due Sale</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg -2">
              {formattedDate.day}
              <Text className="text-primary text-lg m-2">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Due Sale</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Due Sale</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>

        {/* Recived payment recived generat part */}

        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
            12345<Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
            12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
              12345 <Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
        <View className="bg-black-200 p-4 rounded-lg mt-4 w-[380px] h-[84px] p-4 mx-auto">
          <Text className="text-white text-xl">Received Payment</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-lg me-2">
              {formattedDate.day}
              <Text className="text-primary text-lg">
                {formattedDate.month}
              </Text>
              <Text className="text-white text-lg ">{formattedDate.year}</Text>
            </Text>
            <Text className="text-primary font-bold">
            12345<Text className="text-white">BDT</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default CustomerDetails;
