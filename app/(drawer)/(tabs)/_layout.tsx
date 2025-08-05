import { router, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import profile from "../../../assets/images/profile.jpg";
// Add these imports at the top

// Add this custom component after your existing imports
const CustomDrawerToggleButton = ({ tintColor = "#FDB714" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}
    >
      <Ionicons name="menu" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};

//@ts-ignore
const TabIcon = ({icon,iconAlt, name, color, focused})=>{
  return (
    <>
      <View className={`flex items-center justify-center`}>
        <View className={` items-center justify-center ${focused && " justify-center"} `}>
          <View className={`flex items-center justify-center ${focused && "w-16"} `}>
            
            <Ionicons 
            //@ts-ignore
            name={`${focused ? icon: iconAlt}`} 
            // size={ 24} 
            size={focused? 30 : 28} 
            color={color} 
            />
           {focused && <Text className='text-gray-300 font-pregular text-xs'>{name}</Text>} 
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
        tabBarActiveTintColor: '#FDB714', // Primary color for active tabs
        tabBarInactiveTintColor: '#9CA3AF', // Gray-200 for inactive tabs
        tabBarStyle:{
            backgroundColor: '#1F2937', // Dark background color
            borderTopColor: '#1F2937',
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
                title: "FerrariFashion",
                headerTitleAlign: 'center',
                headerTitle: () => (
                    <View className='h-8 w-auto'>
                      {/* <Image 
                        source={logo_h} 
                        className=" w-auto" // Adjust logo size here
                      /> */}
                      <Text className=' font-pbold text-primary'>FerrariFashion</Text>
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
                headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
                headerRight: () => (
                  <TouchableOpacity onPress={()=>router.push({pathname:'/settings/profile'})} className='mx-2 pe-3'>
                    <Image  source={profile} className="h-8 w-8 ms-4 rounded-full"/>
                  </TouchableOpacity>
                  ),             
            }}
        />
        <Tabs.Screen 
            name="stock"
            options={{
                title: "Stock",
                headerTitleAlign: 'left',
                headerTitle: () => (
                    <View>
                      <Text className='font-pbold dark:text-white text-gray-200 text-center text-xl'>Stock</Text>
                    </View>
                  ),
                headerShown: true,
                
                headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
               
                tabBarIcon:({color, focused})=>(
                    <TabIcon
                        icon="time-sharp"
                        iconAlt="time-outline"
                        color={color}
                        name="stock"
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
                headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
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
