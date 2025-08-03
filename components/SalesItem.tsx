import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { format, isToday } from 'date-fns';
import { router } from 'expo-router';

const SalesItem = ({ name, id, invoiceId, totalItem,total, time, avatarUrl,type }: { 
    name: string; 
    id: string; 
    time: string; 
    avatarUrl: string;
    invoiceId:string;
    totalItem:string;
    total:string;
    type:string; }) => {
  return (
    <TouchableOpacity onPress={()=>router.push(`/sales/${id}`)} className="flex-row items-center justify-between py-4  border-slate-200 border-b rounded-lg mb-2">
        {/* <Image  
        //@ts-ignore
        source={avatarUrl} style={styles.avatar} className="w-10 h-10 rounded-full mr-3" /> */}
      <View className="flex-row flex-1 items-center justify-between">
        <View>
          <Text className="font-bold text-lg text-gray-800">{invoiceId}</Text>
          <View className="flex flex-row items-center">
            <Ionicons name="person-outline" size={14}  className='me-1' color={"#"}/>
            <Text className='text-gray-500 text-md '>{name} | </Text>
            <Ionicons name="time-outline" size={14}  className='me-1' color={"#"}/>
            <Text className='text-gray-500 text-md '>
              {isToday(new Date(time)) 
                  ? format(new Date(time), 'h:mm a')  
                  : format(new Date(time), 'd MMM yyyy')} 
            </Text>

          </View>
        </View>
        <View>
          <View className='items-end'>
            <View className='flex flex-row gap-2 justify-between'>
              <Text className="text-slate-600 text-md font-pregular">{totalItem} items </Text>
              <Text className="text-slate-600 text-xl font-psemibold text-right">{total}৳ </Text>
            </View>
            <Text className={`text-right font-pregular ${type === "due" ? "text-red-500" : "text-black"}`}>{type}</Text>
          </View>
        </View>
       </View>
    </TouchableOpacity>
  )
}

export default SalesItem


const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});