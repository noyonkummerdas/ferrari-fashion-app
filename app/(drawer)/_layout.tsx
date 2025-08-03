import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Drawer from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons';
import { Link, router, usePathname, useRouter, useSegments } from 'expo-router';
import profile from "../../assets/images/icon.png"
// import * as globalCon from "@/context/GlobalProvider"
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, iconAlt, color, pathname, focused }) => {
  const isFocused = Array.isArray(focused) ? focused.includes(pathname) : focused === pathname;

  return (
    <>
      <Ionicons 
        //@ts-ignore
        name={isFocused ? icon : iconAlt}
        size={isFocused ? 24 : 26} 
        color={!isFocused ? color : "#fff"} 
        //@ts-ignore
        style={{ marginLeft: isFocused ? 10 : 0 }}
      />
      {/* {isFocused && <Text className='text-slate-700 font-pregular text-xs'>{name}</Text>}  */}
    </>
  );
};

const CustomDrawerComponent = (props:any)=>{
    
    const pathname = usePathname()
    const { loading,loggedIn,logout,userInfo } = useGlobalContext();
    // const router = useRouter();
    const segments = useSegments();
    const [isMounted, setIsMounted] = useState(false);

    // console.log(userInfo)
    
    const checkLogin = ()=>{
        //@ts-ignore
        if (!isMounted || segments?.length === 0) return; 
        // console.log('TAB:', pathname, loggedIn,segments.length);
        
        if (pathname !== '/(auth)/sign-in' && !loggedIn) {
            router.replace('/(auth)/sign-in'); 
        }
    }

    useEffect(() => {
      setIsMounted(true); 
    //   checkLogin()
    }, []);

    useEffect(() => {
        // console.log("PATH:", pathname)
        checkLogin()

    },[pathname, loggedIn, segments, isMounted])

    return(
        <DrawerContentScrollView {...props}>
            <TouchableOpacity onPress={()=>router.push('/')} className='mx-2 pe-3'>
                <View className='flex flex-row gap-x-3 border-b items-center border-slate-400 pb-4 mb-2'>
                    <Image  source={profile} className="h-14 w-14"/>
                    <View>
                        <Text className='text-xl font-pmedium'>{userInfo?.name}</Text>
                        <Text className='text-base'><Text>Aamar ID: </Text>{userInfo?.aamarId}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <DrawerItem
                icon={({color})=>
                        <TabIcon
                            pathname={pathname}
                            icon="storefront"
                            iconAlt="storefront-outline"
                            color={color}
                            focused={["/"]}
                        />}
                label={"Store"}
                labelStyle={[styles.labelStyle, {color: pathname == "/" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname !== "/" ? "#ffffff": "#ff6a39" }}
                onPress={()=>router.push('/(drawer)/(tabs)')}
            /><DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="calculator"
                        iconAlt="calculator-outline"
                        color={color}
                        focused={["/pos"]}
                    />}
                label={"POS"}
                labelStyle={[styles.labelStyle, {color: pathname == "/pos" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname !== "/pos" ? "#ffffff": "#ff6a39" }}
                onPress={()=>router.push('/(drawer)/(tabs)/pos')}
            />
            <DrawerItem
                icon={({color})=>
                        <TabIcon
                            pathname={pathname}
                            icon="cart-sharp"
                            iconAlt="cart-outline"
                            color={color}
                            focused={["/sales"]}
                        />}
                label={"Sales"}
                labelStyle={[styles.labelStyle, {color: pathname == "/sales" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname !== "/sales" ? "#ffffff": "#ff6a39" }}
                onPress={()=>router.push('/(drawer)/(tabs)/sales')}
            />
            <DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="basket"
                        iconAlt="basket-outline"
                        color={color}
                        focused={["/products","/categories","/brands"]}
                    />}
                label={"Products"}
                labelStyle={[styles.labelStyle, {color: pathname == "/products"  || pathname == "/categories" || pathname == "/brands" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname == "/products" || pathname == "/categories" || pathname == "/brands"  ?  "#ff6a39" :"#ffffff" }}
                onPress={()=>router.push("/(drawer)/(products)/products")}
            />
            <DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="people"
                        iconAlt="people-outline"
                        color={color}
                        focused={["/customers","/suppliers","/user"]}
                    />}
                label={"People"}
                labelStyle={[styles.labelStyle, {color: pathname == "/customers"  || pathname == "/suppliers"|| pathname == "/user" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname == "/customers"  || pathname == "/suppliers" || pathname == "/user" ?  "#ff6a39" :"#ffffff" }}
                onPress={()=>router.push("/(drawer)/(tabs)/(connects)/customers")}
            />
            <DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="archive"
                        iconAlt="archive-outline"
                        color={color}
                        focused={["/stock"]}
                    />}
                label={"Stock"}
                labelStyle={[styles.labelStyle, {color: pathname == "/stock" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname !== "/stock" ? "#ffffff": "#ff6a39" }}
                onPress={()=>router.push('/stock/stock')}
            />
            <DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="archive"
                        iconAlt="archive-outline"
                        color={color}
                        focused={["/reports"]}
                    />}
                label={"Reports"}
                labelStyle={[styles.labelStyle, {color: pathname == "/reports" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname !== "/reports" ? "#ffffff": "#ff6a39" }}
                onPress={()=>router.push('/reports')}
            />
            <DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="cog"
                        iconAlt="cog-outline"
                        color={color}
                        focused={["/setting"]}
                    />}
                label={"Setting"}
                labelStyle={[styles.labelStyle, {color: pathname == "/setting" ? "#ffffff": "#475569"}]}
                style={{backgroundColor: pathname !== "/setting" ? "#ffffff": "#ff6a39" }}
                onPress={()=>router.push('/settings/setting')}
            />
            <TouchableOpacity onPress={()=>logout()} className='flex flex-row ms-5 mt-4' >
                <Ionicons name="power" size={24}/>
                <Text className='text-xl font-pmedium text-slate-600 ms-3'>Logout</Text>
            </TouchableOpacity>
            
            
        </DrawerContentScrollView>
    )
}

const DrawerLayout = () => {
  return (
    <Drawer drawerContent={(props)=> <CustomDrawerComponent {...props} />}  screenOptions={{headerShown:false}}/>
  )
}

export default DrawerLayout


const styles = StyleSheet.create({
    labelStyle:{fontSize:18, fontWeight:300
    }
})