import { Text ,ScrollView, RefreshControl, View, useColorScheme, TouchableOpacity, SafeAreaView} from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useEffect, useLayoutEffect, useState } from 'react';
import { format, isToday } from 'date-fns';
import { useAllSaleQuery } from '@/store/api/saleApi';
import SalesItem from '@/components/SalesItem';
import avatarUrl from "../../../assets/images/profile.jpg"
import { useNavigation } from '@react-navigation/native';
import { Foundation, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import DateRangePickerComponent from '@/components/DateRangePickerComponent'

export default function Sales() {
  const {userInfo} = useGlobalContext()
    const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
    const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
    // const [warehouse, setWarehouse] = useState("allWh");
    const aamarId = userInfo?.aamarId;
    const warehouse = userInfo?.warehouse;
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    // const pathname = usePathname()
    // console.log("Path::", pathname)


    // console.log("AamarID Sales::",userInfo?.aamarId)

    
  // useAllSaleQuery
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
  useAllSaleQuery({
    startDate: startDate,
    endDate: endDate,
    warehouse,
    aamarId,
    forceRefetch: true,
  });

  const resetDate = () =>{
    setStartDate(format(new Date(), "MM-dd-yyyy"))
    setEndDate(format(new Date(), "MM-dd-yyyy"))

  }

    // Function to fetch updated data
  const onRefresh = () => {
    setRefreshing(true);
    refetch()
    // Simulate fetching dashboard data
    setTimeout(() => {
      console.log("Sales data refreshed!");
      setRefreshing(false);
    }, 1500);
  };

  // console.log(startDate,endDate)


  useEffect(()=>{
    refetch()
  },[ startDate,endDate])

  //@ts-ignore
  const handleDateSelection = (startDate, endDate) => {
    setStartDate(startDate)
    setEndDate(endDate)
      // console.log("Selected Start Date:", startDate);
      // console.log("Selected End Date:", endDate);
    };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className='flex flex-row me-4' >
          <TouchableOpacity onPress={()=>setOpen(true)}>
            <Ionicons name='calendar-outline' size={24} className='me-4' />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetDate}>
            <SimpleLineIcons name="refresh" size={24} color="black" />
          </TouchableOpacity>
          
        </View>
        ),
      title: "",
      //@ts-ignore
      headerStyle: { backgroundColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}` },
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}`,
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: 'left',
      headerShown: true,
      
    });
  }, [navigation]);

  // console.log("SALES",data?.length)
  return (
    <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      className='p-4 bg-white'  >
        
      {
        //@ts-ignore
        data?.length > 0 ?
        data?.map((sale)=>
          //@ts-ignore
          <SalesItem className="bg-white"  key={sale?._id} avatarUrl={avatarUrl} name={sale.customerName} totalItem={sale.totalItem} invoiceId={sale.invoiceId} id={sale._id} time={sale.createdAt} type={sale.billType} total={sale.roundedGrossTotal} />
        )
      :
      <View className='min-h-screen w-dvw flex justify-center items-center'>

        <Text>No Sales Found</Text>
      </View>
      }
      <DateRangePickerComponent  open={open} setOpen={setOpen} onSelectDates={handleDateSelection}  />
    </ScrollView>
  );
}

