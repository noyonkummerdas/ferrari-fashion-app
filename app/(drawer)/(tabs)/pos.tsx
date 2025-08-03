import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Image, ActivityIndicator,Text, SafeAreaView, View, TextInput, TouchableOpacity, Modal, Switch } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import profile from "../../../assets/images/profile.jpg"
import productPhoto from "../../../assets/images/product.jpg"
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useGlobalContext } from '@/context/GlobalProvider';
import SingleSelect from '@/components/CustomProductSelect';
import { router, usePathname } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, addQuantityReducer, posCalculationReducer, posFinalizerReducer, removeItemFormCartReducer, removeQuantityReducer, saleCardAmount, saleCardName, saleCash, saleMfsAmount, saleMfsName, saleReset, selcetBillerInfo, setDue } from '@/store/slice/posSlice';
import { useProductByEanQuery, useProductByIdQuery } from '@/store/api/searchApi';
import { RootState } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectCustomer from '@/components/CustomCustomerSelect';


const mfs = [
    { value: "bKash", label: "Bkash" },
    { value: "Nagad", label: "Nagad" },
    { value: "Upay", label: "Upay" },
    { value: "Rocket", label: "Rocket" }
];
const cards = [ 
    { value: "visa", label: "VISA" },
    { value: "DBBL", label: "DBBL" },
    { value: "MTB", label: "MTB" },
    { value: "CITY", label: "CITY" },
    { value: "AMEX", label: "AMEX" },
    { value: "EBL", label: "EBL" },
    { value: "BRAC", label: "BRAC" },
    { value: "masterCard", label: "Master Card" }
];

export default function POS() {
  const dispatch = useDispatch()
    const {userInfo} = useGlobalContext()
    const aamarId = userInfo?.aamarId;
    const warehouse = userInfo?.warehouse;
    const posData = useSelector((state:RootState)=>state.pos)
    const [focuse, setFocuse] = useState(false)
    const [focuseCustomer, setFocuseCustomer] = useState(false)
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    
    const [createUserVisible, setCreateUserVisible] = useState(false);
    
    const [isEnabled, setIsEnabled] = useState(false);
    
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
      if(isEnabled === true){
        dispatch(setDue(true))
      }else{
        dispatch(setDue(false))
      }
    },[isEnabled])

    const { data:product, isSuccess,isLoading,isFetching, error, refetch } = useProductByIdQuery({
        aamarId,
        warehouse,
        id:selectedItem?._id,
        forceRefetch: true,
      });
    


      // console.log("first",product)
    useEffect(()=>{

      selectedItem !== null && refetch()
    },[selectedItem])

    useEffect(()=>{
      dispatch(posFinalizerReducer())
      dispatch(posCalculationReducer())
    },[posData.products])

    // console.log("POSDATA",posData.customerPhone === "0171000000", JSON.stringify(posData.customerName, null,1), posData.customerPhone)

    useEffect(()=>{
      // console.log("Product",selectedItem?._id, product)
      if(product){
        if(selectedItem?._id == product?._id){
          dispatch(addProductToCart(product))
          setSelectedItem(null)
        }

      }
    },[isSuccess, product])

    // Handler when an item is selected
    const handleSelectItem = (item:any) => {
      setSelectedItem(item);
      // console.log("Selected Item:", item); // You can dispatch it to Redux or use it in any other way
    };
    const handleSelectCustomer = (item:any) => {
      // console.log("Customer",item);
      // console.log("Selected Item:", item); // You can dispatch it to Redux or use it in any other way
    };
    
    useEffect(()=>{
      // console.log("UserInfo", userInfo)
      dispatch(selcetBillerInfo({
        id:userInfo.id,
        warehouse:userInfo.warehouse,
        aamarId:userInfo.aamarId
      }))
    },[userInfo])
    
    // console.log("STATE DATA::", selectedItem,product, posData.products)
// console.log(warehouse)
  return (
    <SafeAreaView className='bg-white w-full h-full'>
      <View className="flex-1">

      {/* Top Section */}
      <View className="justify-center items-center   px-4">
        
        <View className='flex flex-row w-full gap-2 mt-4'>
          <View className='flex-1' >
            {loading ? (
              <ActivityIndicator size="large" color="#f2652d" />
            ) : (
              <SingleSelect focuse={focuse} setFocuse={setFocuse} onSelect={handleSelectItem} />
            )}
          </View>
          {
            !focuse &&
            <View>
            <TouchableOpacity onPress={()=>router.push("/camera/barCodeScan")} className='bg-primary rounded-md p-4'>
              <Ionicons name='barcode-outline' color={"#fff"} size={24} />
            </TouchableOpacity>
            {/* Reusable Scanner Modal */}
           
          </View>
          }
        </View>
      </View>

      {/* Middle Section */}
      <View className="flex-1 bg-white justify-center items-start   px-4">
        <View className='flex flex-row justify-center items-center  mt-4'>
          <Text className='flex-1 text-2xl font-pmedium'>Products</Text>
          <TouchableOpacity onPress={()=>dispatch(saleReset())} className='flex flex-row'>
            <Ionicons name='close' size={20} /> 
            <Text className='text-md'>Clear Cart</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className='py-4 w-full'>
          {
            posData?.products.length !== 0 ? (
            posData?.products.map((product:any)=><CartItem
                key={product?.article_code}
                name={product?.name}
                photo={product?.photo}
                price={product?.mrp}
                total={product?.total}
                qty={product?.qty}
                article_code={product?.article_code}
              />
            )
          ): (
            <View className='flex items-center justify-center  mt-56 w-full'>
              <Ionicons name='cart-outline' size={80} color={"#f2652d"} className="text-center mb-4" />
              <Text className="text-2xl font-bold text-center text-gray-300 mb-4">Cart is Empty!</Text>
            </View>
          )
          }
      </ScrollView>
      </View>

      

      {/* Bottom Section */}
      <View className=" justify-center items-center w-full px-4">
        {/* Price Breakdown */}
        <TouchableOpacity onPress={() => router.push("/sales/finalize-sale")} className='flex flex-row w-full items-center h-16 justify-between px-6 bg-primary mx-2 rounded-full mb-4'>
          <Text className='text-xl text-white'>Process Order</Text>
          <View className='flex flex-row gap-4 items-center'>
            <Text  className='text-xl text-white'>{posData.totalItem} Items</Text>
            <Text  className='text-2xl font-psemibold text-white'>${posData.grossTotalRound}</Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

    </View>
    </SafeAreaView>
  );
}


const CartItem = ({ name, photo, price,total, qty, article_code }:any) => {  
  const dispatch = useDispatch()

  const [imageError, setImageError] = useState(false);
  const imageSource = imageError || !photo ? productPhoto : { uri: photo };

  // console.log("CartItem", name, photo, price,total, qty, imageSource)
  return (<View className='flex flex-row gap-4 bg-slate-50 p-3 mb-3 py-4 shadow-slate-400 rounded-md'>
    <Image
            source={imageSource}
            className='h-20 w-20 rounded-lg' 
            resizeMode="contain"
            onError={() => {
                console.log("Image failed to load:", photo); // Debugging log
                setImageError(true);
            }}
            />
    <View className='flex-1 gap-2 justify-between flex w-full'>
      <View className='flex flex-row justify-between gap-2 items-start '>
        <Text className='text-lg font-pregular flex-1'>{name}</Text>
        <TouchableOpacity onPress={()=>dispatch(removeItemFormCartReducer(article_code))}>
          <Ionicons name={"close"}  size={26} className='h-6 w-6' />
        </TouchableOpacity>
      </View>
      <View className='flex flex-row justify-between items-end'>
        <Text className='text-2xl flex-1 font-pmedium'>${total}</Text>
        <View className='flex flex-row items-center gap-3'>
          <TouchableOpacity onPress={()=>dispatch(removeQuantityReducer(article_code))} className='bg-slate-200 p-2 rounded-lg'>
            <Ionicons name={"remove"} size={20} />
          </TouchableOpacity>
          <Text className='text-xl font-psemibold' >{qty}</Text>
          {/* <TextInput className='text-xl font-psemibold' value={qty}/> */}
          <TouchableOpacity onPress={()=>dispatch(addQuantityReducer(article_code))} className='bg-slate-500 p-2 rounded-lg'>
            <Ionicons name={"add"} color={"#fff"} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>)
};

const PriceRow = ({ label, value }:any) => (
  <View className="flex-row justify-between mb-2">
    <Text className="text-gray-600">{label}</Text>
    <Text className="font-semibold">{value}</Text>
  </View>
);


 const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 45,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      width:200
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });