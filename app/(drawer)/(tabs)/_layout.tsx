import { router, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {  Image,Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import profile from "../../../assets/images/profile.jpg"
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '@/context/GlobalProvider';
import logo_h from "../../../assets/images/logo-h.png"
import { DrawerToggleButton } from '@react-navigation/drawer';

//@ts-ignore
const TabIcon = ({icon,iconAlt, name, color, focused})=>{
  return (
    <>
      <View className={`flex items-center justify-center`}>
        <View className={` items-center justify-center ${focused && "bg-white rounded-full justify-center"} `}>
          <View className={`flex items-center justify-center ${focused && "w-16"} `}>
            
            <Ionicons 
            //@ts-ignore
            name={`${focused ? icon: iconAlt}`} 
            // size={ 24} 
            size={focused? 30 : 28} 
            color={color} 
            />
           {focused && <Text className='text-slate-700 font-pregular text-xs'>{name}</Text>} 
          </View>
        </View>         
      </View>
      </>
  )
}


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [isSearch, setIsSearch] = useState(false)
  const [searchQuery, setSearchQuery]= useState("");


  useEffect(()=>{
    if(isSearch === false){
      setSearchQuery("")
    }
  },[isSearch])

  
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
            height:64,
            overflow:"hidden",
            width:"auto",
            paddingBottom: 10,
            paddingTop: 10,
        },
        headerLeft:()=>(
          <DrawerToggleButton />
        ),
      }}>
         <Tabs.Screen 
            name="index"
            options={{
                title: "AamarDokan",
                headerTitleAlign: 'center',
                headerTitle: () => (
                    <View className='h-8 w-auto'>
                      <Image 
                        source={logo_h} 
                        className=" w-auto" // Adjust logo size here
                      />
                    </View>
                  ),
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="storefront-sharp"
                        iconAlt="storefront-outline"
                        color={color}
                        name="store"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push({pathname:'/settings/profile'})} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
        <Tabs.Screen 
            name="sales"
            options={{
                title: "Sales",
                headerTitleAlign: 'left',
                headerTitle: () => (
                    <View>
                      <Text className='font-pbold dark:text-white text-center text-xl'>Sales</Text>
                    </View>
                  ),
                headerShown: true,
                
               
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="cart-sharp"
                        iconAlt="cart-outline"
                        color={color}
                        name="sales"
                        focused={focused}
                    />
                )               
            }}
        />
        <Tabs.Screen 
            name="pos"
            options={{
                title: "POS",
                headerTitleAlign: 'left',
                headerTitle: () => (
                    <View>
                      <Text className='font-pbold dark:text-white text-center text-xl'>POS</Text>
                    </View>
                  ),
                headerShown: true,
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="calculator"
                        iconAlt="calculator-outline"
                        color={color}
                        name="POS"
                        focused={focused}
                    />
                )               
            }}
        />
        <Tabs.Screen
          name="(products)"
          options={{
            title: "Products",
            headerTitleAlign: 'left',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="bag"
                iconAlt="bag-outline"
                color={color}
                name="Products"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(connects)"
          options={{
            title: "People",
            headerTitleAlign: 'left',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="people"
                iconAlt="people-outline"
                color={color}
                name="People"
                focused={focused}
              />
            ),
          }}
        />
      
    </Tabs>
  );
}
