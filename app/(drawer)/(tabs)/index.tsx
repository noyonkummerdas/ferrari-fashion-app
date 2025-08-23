import { DashboardCard } from "@/components/DashboardCard";
import { PaymentChart } from "@/components/PaymentChart";
import { StatsGrid } from "@/components/StatsGrid";
import { WelcomeCard } from "@/components/WelcomeCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { subDays } from "date-fns/subDays";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
// import {
//   useChartSaleQuery,
//   useDashboardSaleQuery,
//   useLatestSaleQuery,
// } from "../../../store/api/saleApi";

const screenWidth = Dimensions.get("window").width;
const profile = require("../../../assets/images/profile.jpg");

export default function PosDashboard() {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  // const [warehouse, setWarehouse] = useState("allWh");
  const { userInfo, fetchUser } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  // console.log("AamarID::",userInfo?.aamarId)

  // console.log(userInfo);

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [chartSale, setChartSale] = useState([]);
  const [latestSale, setlatestSale] = useState([]);

  // const { data, error, isLoading, isFetching, isSuccess, refetch } =
  //   useDashboardSaleQuery({
  //     startDate: startDate,
  //     endDate: endDate,
  //     warehouse,
  //     aamarId,
  //     forceRefetch: true,
  //   });

  // const {
  //   data: chartSale,
  //   error: chartError,
  //   isLoading: chartLoading,
  //   isFetching: chartFetching,
  //   isSuccess: chartSuccess,
  //   refetch: chartRefetch,
  // } = useChartSaleQuery({
  //   warehouse,
  //   aamarId,
  //   forceRefetch: true,
  // });

  // // console.log("Dashboaard", chartSale)
  // const {
  //   data: latestSale,
  //   error: latestError,
  //   isLoading: latestLoading,
  //   isFetching: latestFetching,
  //   isSuccess: latestSuccess,
  //   refetch: latestRefetch,
  // } = useLatestSaleQuery({
  //   warehouse,
  //   aamarId,
  //   limit: 5,
  //   forceRefetch: true,
  // });

  // useEffect(() => {
  //   chartRefetch();
  // }, [aamarId, warehouse]);

  // // console.log("DASHBOARD->latestSale::",chartSale,warehouse,aamarId)

  // useEffect(() => {
  //   // console.log(data);
  //   refetch();
  // }, [aamarId, warehouse]);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSelectDay = (day: number) => {
    const today = new Date();
    const last3Day = subDays(today, 3);
    const last7Day = subDays(today, 7);
    const last30Day = subDays(today, 30);

    setEndDate(format(new Date(), "MM-dd-yyyy"));
    if (day === 3) {
      setStartDate(format(new Date(last3Day), "MM-dd-yyyy"));
    } else if (day === 7) {
      setStartDate(format(new Date(last7Day), "MM-dd-yyyy"));
    } else if (day === 30) {
      setStartDate(format(new Date(last30Day), "MM-dd-yyyy"));
    } else {
      setStartDate(format(new Date(), "MM-dd-yyyy"));
    }
    // refetch();
  };

  // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);

    // refetch();
    // chartRefetch();
    // latestRefetch();
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Dashboard data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    // refetch();
  }, [startDate, endDate, warehouse, aamarId]);

  // Prepare stats data for grid
  const statsData = [
    {
      title: "Total Products",
      value: "23",
      iconName: "cube" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(products)" as any),
    },
    {
      title: "Stock Items",
      value: "2345",
      iconName: "archive" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(stock)"),
    },
    {
      title: "Suppliers",
      value: "10",
      iconName: "people" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(connects)/suppliers"),
    },
    {
      title: "Customers",
      value: "127",
      iconName: "person" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(connects)/customers"),
    },
    {
      title: "Categories",
      value: "8",
      iconName: "grid" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(products)" as any),
    },
    {
      title: "Brands",
      value: "15",
      iconName: "diamond" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(products)" as any),
    },
    {
      title: "Low Stock",
      value: "5",
      iconName: "warning" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/(stock)"),
    },
    {
      title: "Orders",
      value: "42",
      iconName: "receipt" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/(drawer)/(tabs)/accounts"),
    },
  ];

  return (
    <>
      <ScrollView
        className="flex-1 bg-black-700 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <WelcomeCard
          userName={userInfo?.name || "NK Noyon"}
          userImage={profile}
          onProfilePress={() => router.push("/settings/profile")}
        />

        {/* Cash In/Out Cards */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <DashboardCard
              title="Cash In"
              value="2384210"
              iconName="wallet"
              bgColor="bg-black-200"
            />
          </View>
          <View className="flex-1 ml-2">
            <DashboardCard
              title="Cash Out"
              value="4342422"
              iconName="card"
              bgColor="bg-black-200"
            />
          </View>
        </View>

        {/* Second Row Cash In/Out */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <DashboardCard
              title="Cash In"
              value="2384210"
              iconName="trending-up"
              bgColor="bg-black-200"
            />
          </View>
          <View className="flex-1 ml-2">
            <DashboardCard
              title="Cash Out"
              value="4342422"
              iconName="trending-down"
              bgColor="bg-black-200"
            />
          </View>
        </View>

        {/* Stats Grid */}
        <StatsGrid stats={statsData} />

        {/* Payment & Collections Chart */}
        <View className="mt-4">
          <Text className="text-white text-lg font-pbold mb-3">
            Payments & Collections
          </Text>
          <PaymentChart />
        </View>

        <StatusBar style="light" />
      </ScrollView>
    </>
  );
}
