import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname, useSegments } from 'expo-router';
import Drawer from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import profile from "../../assets/images/icon.png";
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
        color={isFocused ? "#FDB714 " : "#FDB714"} 
        //@ts-ignore
        style={{ marginLeft: isFocused ? 10 : 0 }}
      />
        {
        // isFocused && <Text style={{ color: color, fontSize: 12, marginLeft: 5 }}>{name}</Text>
        }
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
                        <Text className='text-xl text-gray-200 font-pmedium'>{userInfo?.name}</Text>
                        <Text className='text-base text-gray-200'><Text className='text-gray-200'>Aamar ID: </Text>{userInfo?.aamarId}</Text>
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
                labelStyle={[styles.labelStyle, {color: pathname == "/" ? "#000000": "#ffffff"}]}
                style={{backgroundColor: pathname !== "/" ? "#000000": "#FDB714"  }}
                onPress={()=>router.push('/(drawer)/(tabs)')}
            /><DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="Home"
                        iconAlt="home-outline"
                        color={color}
                        focused={["/home"]}
                    />}
                label={"Home"}
                labelStyle={[styles.labelStyle, {color: pathname == "/home" ? "#000000": "#ffffff"}]}
                style={{backgroundColor: pathname !== "/home" ? "#000000": "#FDB714" }}
                onPress={()=>router.push('/screen/home')}
            />
            <DrawerItem
                icon={({color})=>
                        <TabIcon
                            pathname={pathname}
                            icon="warehouse"
                            iconAlt="warehouse-outline"
                            color={color}
                            focused={["/warehouse"]}
                        />}
                label={"Warehouse"}
                labelStyle={[styles.labelStyle, {color: pathname == "/warehouse"  ? "#000000": "#ffffff"}]}
                style={{backgroundColor: pathname !== "/warehouse" ? "#000000": "#FDB714" }}
                onPress={()=>router.push('/screen/warehouse')}
            />
            <DrawerItem
                icon={({size,color,focused})=>
                        <TabIcon
                        pathname={pathname}
                        icon="basket"
                        iconAlt="basket-outline"
                        color={color}
                        focused={["/supplire"]}
                    />}
                label={"Supplire "}
                labelStyle={[styles.labelStyle, {color: pathname == "/supplire"  || pathname == "/categories" || pathname == "/brands" ? "#000000": "#ffffff"}]}
                style={{backgroundColor: pathname == "/supplire" || pathname == "/categories" || pathname !== "/brands"  ?  "#000000": "#FDB714" }}
                onPress={()=>router.push("/screen/supplire")}
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
                label={"customers"}
                labelStyle={[styles.labelStyle, {color: pathname == "/customers"  || pathname == "/suppliers"|| pathname == "/user" ? "#000000": "#ffffff"}]}
                style={{backgroundColor: pathname == "/customers"  || pathname == "/suppliers" || pathname !== "/user" ?  "#000000" :"#FDB714" }}
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
                labelStyle={[styles.labelStyle, {color: pathname == "/stock" ?"#000000": "#ffffff"}]}
                style={{backgroundColor: pathname !== "/stock" ? "#000000" :"#FDB714" }}
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
                labelStyle={[styles.labelStyle, {color: pathname == "/reports" ?"#000000": "#ffffff"}]}
                style={{backgroundColor: pathname !== "/reports" ? "#000000" :"#FDB714" }}
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
                labelStyle={[styles.labelStyle, {color: pathname == "/setting" ? "#000000": "#ffffff"}]}
                style={{backgroundColor: pathname !== "/setting" ? "#000000" :"#ff6a39" }}
                onPress={()=>router.push('/settings/setting')}
            />
            <TouchableOpacity onPress={()=>logout()} className='flex flex-row ms-5 mt-4' >
                <Ionicons name="power" size={24} color={"#ff6a39"} />
                <Text className='text-xl font-pmedium text-gray-400 ms-3'>Logout</Text>
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