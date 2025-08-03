import { router, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {  Image,Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import profile from "../../../../assets/images/profile.jpg"
import { useNavigation } from '@react-navigation/native';
import { DrawerToggleButton } from '@react-navigation/drawer';

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
            
           {/* {focused && <Text className='text-slate-700 mt-1 font-pmedium text-xl'>{name}</Text>}  */}
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
            name="products"
            options={{
                title: "Products",
                headerTitleAlign: 'center',
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="basket-sharp"
                        iconAlt="basket-outline"
                        color={color}
                        name="Products"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/products')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
         <Tabs.Screen 
            name="categories"
            options={{
                title: "Categories",
                headerTitleAlign: 'center',
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="albums-sharp"
                        iconAlt="albums-outline"
                        color={color}
                        name="Category"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/categories')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
         <Tabs.Screen 
            name="brands"
            options={{
                title: "Brands",
                headerTitleAlign: 'center',
                // headerTitle: () => (
                //     <View className='h-8 w-auto'>
                //       <Image 
                //         source={logo_h} 
                //         className=" w-auto" // Adjust logo size here
                //       />
                //     </View>
                //   ),
                headerShown: true,
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="balloon-sharp"
                        iconAlt="balloon-outline"
                        color={color}
                        name="Brands"
                        focused={focused}
                    />
                ),  
                
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push('/brands')} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
              
    </Tabs>
  );
}
