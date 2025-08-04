import { Dimensions, RefreshControl, ScrollView, Text } from 'react-native';
import { useGlobalContext } from "../../../context/GlobalProvider";


import { format } from "date-fns";
import { subDays } from "date-fns/subDays";
import { useEffect, useState } from 'react';
import {
  useChartSaleQuery,
  useDashboardSaleQuery,
  useLatestSaleQuery
} from "../../../store/api/saleApi";

const screenWidth = Dimensions.get('window').width;


export default function PosDashboard() {
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  // const [warehouse, setWarehouse] = useState("allWh");
  const {userInfo,fetchUser} = useGlobalContext()
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  // console.log("AamarID::",userInfo?.aamarId)

  const [refreshing, setRefreshing] = useState(false);
  
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
  useDashboardSaleQuery({
    startDate: startDate,
    endDate: endDate,
    warehouse,
    aamarId,
    forceRefetch: true,
  });

  
  const { data:chartSale, error:chartError, isLoading:chartLoading, isFetching:chartFetching, isSuccess:chartSuccess, refetch:chartRefetch } =
  useChartSaleQuery({
    warehouse,
    aamarId,
    forceRefetch: true,
  });

  // console.log("Dashboaard", chartSale)
  const { data:latestSale, error:latestError, isLoading:latestLoading, isFetching:latestFetching, isSuccess:latestSuccess, refetch:latestRefetch } =
  useLatestSaleQuery({
    warehouse,
    aamarId,
    limit:5,
    forceRefetch: true,
  });

  useEffect(() => {
    chartRefetch();
  }, [aamarId, warehouse]);
  
  // console.log("DASHBOARD->latestSale::",chartSale,warehouse,aamarId)

  useEffect(() => {
    // console.log(data);
    refetch()
  }, [aamarId, warehouse]);

  useEffect(() => {
    fetchUser()
  }, []);

  const handleSelectDay = (day:number) => {
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
    refetch();
  };


  // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);

    refetch()
    chartRefetch()
    latestRefetch()
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Dashboard data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  

  useEffect(() => {
    refetch();
  }, [startDate, endDate, warehouse, aamarId]);

  // console.log(data,error,isFetching, isLoading, isSuccess)
  // console.log(latestSale,latestError)
  return (
    <ScrollView className="flex-1 bg-dark p-4"
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
     <Text className='text-gray-200 font-pbold'>Dashboard</Text>
    </ScrollView>
  );
}

// Overview Card Component
// function OverviewCard({ title, value, bgColor, textColor, icon }: { title: string; value: string; bgColor: string; textColor: string; icon: JSX.Element }) {
//   return (
//     <View className={`w-[48%] p-4 mb-4 rounded-lg flex-row bg-gray-50 items-center`}>
//       <View className={` ${bgColor} p-4 rounded-md mr-2`}>

//       {icon}
//       </View>
//       <View className="ml-2">
//         <Text className={`text-sm ${textColor}`}>{title}</Text>
//         <Text className={`text-2xl font-bold ${textColor}`}>{value}</Text>
//       </View>
//     </View>
//   );
// }
