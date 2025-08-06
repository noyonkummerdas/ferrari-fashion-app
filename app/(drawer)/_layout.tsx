import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname, useSegments } from "expo-router";
import Drawer from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import profile from "../../assets/images/icon.png";
// import * as globalCon from "@/context/GlobalProvider"
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, iconAlt, color, pathname, focused }) => {
  const isFocused = Array.isArray(focused)
    ? focused.includes(pathname)
    : focused === pathname;

  return (
    <>
      <Ionicons
        //@ts-ignore
        name={isFocused ? icon : iconAlt}
        size={isFocused ? 24 : 26}
        color={isFocused ? "#FDB714" : color}
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

const CustomDrawerComponent = (props: any) => {
  const pathname = usePathname();
  const { loading, loggedIn, logout, userInfo } = useGlobalContext();
  // const router = useRouter();
  const segments = useSegments();
  const [isMounted, setIsMounted] = useState(false);

  // console.log(userInfo)

  const checkLogin = () => {
    //@ts-ignore
    if (!isMounted || segments?.length === 0) return;
    // console.log('TAB:', pathname, loggedIn,segments.length);
    // router.replace("/(drawer)/(tabs)/index");

    // if (pathname !== '/(auth)/sign-in' && !loggedIn) {
    //     router.replace('/(auth)/sign-in');
    // }
  };

  useEffect(() => {
    setIsMounted(true);
    //   checkLogin()
  }, []);

  useEffect(() => {
    // console.log("PATH:", pathname)
    checkLogin();
  }, [pathname, loggedIn, segments, isMounted]);

  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity onPress={() => router.push("/")} className="mx-2 pe-3">
        <View className="flex flex-row gap-x-3 border-b items-center border-slate-400 pb-4 mb-2">
          <Image source={profile} className="h-14 w-14" />
          <View>
            <Text className="text-xl text-gray-200 font-pmedium">
              {userInfo?.name}
            </Text>
            <Text className="text-base text-gray-200">
              <Text className="text-gray-200">Aamar ID: </Text>
              {userInfo?.aamarId}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <DrawerItem
        icon={({ color }) => (
          <TabIcon
            pathname={pathname}
            icon="user"
            iconAlt="user-outline"
            color={color}
            focused={["/user"]}
          />
        )}
        label={"User"}
        labelStyle={[
          styles.labelStyle,
          { color: pathname == "/" ? "#ffffff" : "#ffffff" },
        ]}
        style={{ backgroundColor: pathname === "/" ? "#000000" : "#131313" }}
          onPress={() => router.push("/(drawer)/(tabs)/user")}
      />
      <DrawerItem
        icon={({ color }) => (
          <TabIcon
            pathname={pathname}
            icon="home"
            iconAlt="home-outline"
            color={color}
            focused={["/"]}
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.labelStyle,
          { color: pathname == "/" ? "#ffffff" : "#ffffff" },
        ]}
        style={{ backgroundColor: pathname === "/" ? "#000000" : "#131313" }}
        onPress={() => router.push("/(drawer)/(tabs)")}
      />
      <DrawerItem
        icon={({ color }) => (
          <TabIcon
            pathname={pathname}
            icon="storefront"
            iconAlt="storefront-outline"
            color={color}
            focused={["/warehouse"]}
          />
        )}
        label={"Warehouse"}
        labelStyle={[
          styles.labelStyle,
          { color: pathname == "/warehouse" ? "#ffffff" : "#ffffff" },
        ]}
        style={{
          backgroundColor: pathname === "/warehouse" ? "#000000" : "#131313",
        }}
        onPress={() => router.push("/(drawer)/warehouse")}
      />
      <DrawerItem
        icon={({ size, color, focused }) => (
          <TabIcon
            pathname={pathname}
            icon="archive"
            iconAlt="archive-outline"
            color={color}
            focused={["/stock"]}
          />
        )}
        label={"Stock"}
        labelStyle={[
          styles.labelStyle,
          { color: pathname == "/stock" ? "#ffffff" : "#ffffff" },
        ]}
        style={{
          backgroundColor: pathname == "/stock" ? "#000000" : "#131313",
        }}
        onPress={() => router.push("/stock/stock")}
      />
      <DrawerItem
        icon={({ size, color, focused }) => (
          <TabIcon
            pathname={pathname}
            icon="people"
            iconAlt="people-outline"
            color={color}
            focused={["/suppliers"]}
          />
        )}
        label={"Suppliers"}
        labelStyle={[
          styles.labelStyle,
          {
            color: pathname == "/suppliers" ? "#ffffff" : "#ffffff",
          },
        ]}
        style={{
          backgroundColor: pathname == "/suppliers" ? "#000000" : "#131313",
        }}
        onPress={() => router.push("/(drawer)/(tabs)/(connects)/suppliers")}
      />
      <DrawerItem
        icon={({ size, color, focused }) => (
          <TabIcon
            pathname={pathname}
            icon="people"
            iconAlt="people-outline"
            color={color}
            focused={["/customers"]}
          />
        )}
        label={"customers"}
        labelStyle={[
          styles.labelStyle,
          {
            color: pathname == "/customers" ? "#ffffff" : "#ffffff",
          },
        ]}
        style={{
          backgroundColor: pathname == "/customers" ? "#000000" : "#131313",
        }}
        onPress={() => router.push("/(drawer)/(tabs)/(connects)/customers")}
      />

      <DrawerItem
        icon={({ size, color, focused }) => (
          <TabIcon
            pathname={pathname}
            icon="archive"
            iconAlt="archive-outline"
            color={color}
            focused={["/reports"]}
          />
        )}
        label={"Reports"}
        labelStyle={[
          styles.labelStyle,
          { color: pathname == "/reports" ? "#ffffff" : "#ffffff" },
        ]}
        style={{
          backgroundColor: pathname === "/reports" ? "#000000" : "#131313",
        }}
        onPress={() => router.push("/(drawer)/reports")}
      />
      <DrawerItem
        icon={({ size, color, focused }) => (
          <TabIcon
            pathname={pathname}
            icon="cog"
            iconAlt="cog-outline"
            color={color}
            focused={["/setting"]}
          />
        )}
        label={"Setting"}
        labelStyle={[
          styles.labelStyle,
          { color: pathname == "/setting" ? "#ffffff" : "#ffffff" },
        ]}
        style={{
          backgroundColor: pathname == "/setting" ? "#000000" : "#131313",
        }}
        onPress={() => router.push("/settings/setting")}
      />
      <TouchableOpacity
        onPress={() => logout()}
        className="flex flex-row ms-5 mt-4"
      >
        <Ionicons name="power" size={24} color={"#ff6a39"} />
        <Text className="text-xl font-pmedium text-gray-400 ms-3">Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerLayout = () => {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerComponent {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  labelStyle: { fontSize: 18, fontWeight: 300 },
});
