import { router, Tabs } from 'expo-router';
import React from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import profile from "../../../../assets/images/profile.jpg";

//@ts-ignore
const TabIcon = ({icon,iconAlt, name, color, focused})=>{
  return (
    <>
      <View className={`flex items-center justify-center w-52 mb-0 mt-1`}>
          <View className="flex flex-row items-center gap-2">
            <Ionicons 
            //@ts-ignore
            name={`${focused ? icon: iconAlt}`} 
            // size={ 24} 
            size={focused? 30 : 28} 
            color={color} 
            />
           {<Text className={` mt-1  ${focused ? "font-pmedium text-xl text-primary" :"text-slate-700 font-pregular text-md"}`}> {name}</Text>} 
          </View>
      </View>
      </>
  )
}


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();


  
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel:false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor:"#CDCDE0",
        tabBarStyle:{
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopColor: Colors[colorScheme ?? 'light'].background,
            borderTopWidth:1,
            height:60,
            overflow:"hidden",
            width:"auto"
        },
        headerLeft:()=>(
          <DrawerToggleButton />
        ),
      }}>
         <Tabs.Screen 
            name="customers"
            options={{
                title: "customers",
                headerTitleAlign: 'center',
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="people-sharp"
                        iconAlt="people-outline"
                        color={color}
                        name="Customer"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/customers')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
         <Tabs.Screen 
            name="suppliers"
            options={{
                title: "suppliers",
                headerTitleAlign: 'center',
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="people-circle-sharp"
                        iconAlt="people-circle-outline"
                        color={color}
                        name="Supplier"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/suppliers')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
        <Tabs.Screen 
            name="Settings"
            options={{
                title: "Users",
                headerTitleAlign: 'center',
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="person-circle-sharp"
                        iconAlt="person-circle-outline"
                        color={color}
                        name="Users"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/user/add-user')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
             
    </Tabs>
  );
}
