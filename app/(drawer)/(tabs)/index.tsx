import { DashboardCard } from "@/components/DashboardCard";
import { PaymentChart } from "@/components/PaymentChart";
import { WelcomeCard } from "@/components/WelcomeCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useDashbordQuery } from "@/store/api/dashbordApi";
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
  TouchableOpacity,
  View,
} from "react-native";
// import {
//   useChartSaleQuery,
//   useDashboardSaleQuery,
//   useLatestSaleQuery,
// } from "../../../store/api/saleApi";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth * 0.4; 
const profile = require("../../../assets/images/profile.jpg");

export default function PosDashboard() {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  // const [warehouse, setWarehouse] = useState("allWh");
  const { userInfo, fetchUser } = useGlobalContext();
  const type = userInfo?.type;
  const [warehouse, setWarehouse] = useState(userInfo?.type && userInfo?.type !== "admin" && userInfo?.warehouse || "all");
 

  const { data: dashboardData, error, isLoading, isFetching, isSuccess, refetch } = useDashbordQuery({ warehouse: warehouse, date: startDate, type: type } as any);

  // console.log(dashboardData, error, isLoading, isFetching, isSuccess, refetch);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setWarehouse(userInfo?.type && userInfo?.type !== "admin" && userInfo?.warehouse || "all");
  }, [type]);

  useEffect(() => {
    fetchUser();
  }, []);
  
  useEffect(() => {
    fetchUser();
  }, [warehouse]);



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
    refetch();
  }, [startDate, warehouse]);


  interface StatItemProps {
    title: string;
    value: string | number;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
  }
  
  const StatItem: React.FC<StatItemProps> = ({
    title,
    value,
    iconName,
    onPress,
  }) => {
    const ItemWrapper = onPress ? TouchableOpacity : View;
  
    return (
      <ItemWrapper
        className="bg-black-200 p-4 rounded-lg mr-3"
        style={{
          width: cardWidth,
          height: cardWidth, // Make it square
          minHeight: 120,
        }}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {/* Icon at top left */}
        <View className="flex-row justify-start mb-2">
          <View className="bg-primary/10 p-2 rounded-lg">
            <Ionicons name={iconName} size={20} color="#FDB714" />
          </View>
        </View>
        {/* Title at bottom */}
        <View className="justify-end">
          <Text className="text-gray-400 text-xs leading-3">{title}</Text>
        </View>
  
        {/* Value - large number */}
        <View className="flex-1 justify-center">
          <Text className="text-white text-3xl font-pbold mb-1">{value}</Text>
        </View>
      </ItemWrapper>
    );
  };
  
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
              value={dashboardData?.accountsData?.deposit?.totalAmount || 0}
              iconName="wallet"
              bgColor="bg-black-200"
            />
          </View>
          <View className="flex-1 ml-2">
            <DashboardCard
              title="Cash Out"
              value={dashboardData?.accountsData?.cashOut?.totalAmount || 0}
              iconName="card"
              bgColor="bg-black-200"
            />
          </View>
        </View>

        {/* Second Row Cash In/Out */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <DashboardCard
              title="Payment"
              value={dashboardData?.accountsData?.payment?.totalAmount || 0}
              iconName="trending-up"
              bgColor="bg-black-200"
            />
          </View>
          <View className="flex-1 ml-2">
            <DashboardCard
              title="Received"
              value={dashboardData?.accountsData?.paymentReceived?.totalAmount || 0}
              iconName="trending-down"
              bgColor="bg-black-200"
            />
          </View>
        </View>

        {/* Stats Grid */}
        {/* <StatsGrid stats={statsData} /> */}

        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            className="flex-row"
          >
              <StatItem 
               title="Total Products"
               value={dashboardData?.productCount || 0}
               iconName="cube"
               onPress={() => router.push("/(drawer)/(tabs)/(stock)/products" )}
                />
              <StatItem 
              title="Stock Items"
               value={dashboardData?.customerCount || 0}
               iconName="archive"
               onPress={() => router.push("/(drawer)/(tabs)/(stock)")}
                />
              <StatItem 
              title="Suppliers"
               value={dashboardData?.productCount || 0}
               iconName="people"
               onPress={() => router.push("/(drawer)/(tabs)/(connects)/suppliers" as any)}
                />
              <StatItem 
               title="Customers"
               value={dashboardData?.customerCount || 0}
               iconName="person"
               onPress={() => router.push("/(drawer)/(tabs)/(connects)/customers")}
                />
              <StatItem title="Orders"
               value={dashboardData?.orderCount || 0}
               iconName="receipt"
               onPress={() => router.push("/(drawer)/(tabs)/accounts")}
             />
          </ScrollView>
        </View>

        {/* Payment & Collections Chart */}
        <View className="mt-4">
          <Text className="text-white text-lg font-pbold mb-3">
            Payments & Collections
          </Text>
          <PaymentChart data={dashboardData?.chartData || {}} />
        </View>

        <StatusBar style="light" />
      </ScrollView>
    </>
  );
}
