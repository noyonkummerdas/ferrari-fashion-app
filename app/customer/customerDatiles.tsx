import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CustomerDetails = () => {
  

//date formatting
  const today = new Date();
const formattedDate = {
  day: today.getDate(),
  month: today.toLocaleString("en-US", { month: "long" }), // e.g. August
  year: today.getFullYear()
};
// const [headerName, setHeaderName] = useState(arrayCustomersd[0].name);
  const arrayCustomersd =[
    {
      id:1, 
      name: "MANISHANKAR VAKTA ",
      email: "john.doe@example.com",
      phone: "01687233969",
      address: "123 Main St, Anytown, USA"
    }
  ]

  return (
   <>
       <ScrollView>
   
    <View>
      {
        arrayCustomersd.map(customer => (
          <View key={customer.id} className="mb-4">
            <Text className="text-lg font-bold text-white">{customer.name}</Text>
            <Text className="text-gray-400">{customer.email}</Text>
            <Text className="text-gray-400">{customer.phone}</Text>
            <Text className="text-gray-400">{customer.address}</Text>
          </View>
        ))
      }
    </View>

    {/* calendar */}

    <View className="flex flex-row justify-between items-center bg-black-200  p-3 rounded-lg">
         <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>
         <View className=" flex flex-row item-center bg-black-200">
          <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
         </View>

         <TouchableOpacity>
          <Ionicons name="arrow-forward" size={24} color="white" />
         </TouchableOpacity>
    </View>

    <View className="flex flex-row justify-between items-center mt-4   ">
       <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg" >
        <Text className="text-white text-xl ">Starting balance</Text>
        <Text className="text-primary font-bold text-center text-xl">234234 <Text className="text-white">BDT</Text></Text>
       </View>
       <View className="flex bg-black-200 item-center justify-center p-10 text-center rounded-lg">
        <Text className="text-white text-xl">Current balance</Text>
        <Text className="text-primary font-bold text-xl text-center">38234 <Text className="text-white">BDT</Text></Text>
       </View>
    </View>


     
 
          {/* Due sell generat part */}
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Due Sale</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg -2">{formattedDate.day}<Text className="text-primary text-lg m-2">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Due Sale</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Due Sale</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    
    

    {/* Recived payment recived generat part */}

    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Received Payment</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Received Payment</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Received Payment</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Received Payment</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
    <View className="bg-black-200 p-4 rounded-lg mt-4" > 
        <Text className="text-white text-xl">Received Payment</Text>
        <View className='flex flex-row justify-between items-center'>
            <Text className="text-white text-lg me-2">{formattedDate.day}<Text className="text-primary text-lg">{formattedDate.month}</Text> <Text className="text-white text-lg ">{formattedDate.year}</Text></Text>
           <Text className="text-primary font-bold">12345 <Text className="text-white">BDT</Text></Text>
        </View>
       </View>
     </ScrollView>

   </>
  )
}

export default CustomerDetails;
