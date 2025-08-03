import React, { useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { router } from "expo-router";
import productPhoto from "../assets/images/product.jpg"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface Items {
  id:String;
  name:String;
  code:String | null;
  mc:String;
  mcId:String;
  mc_name:String;
  status:String;
  group:String;  
}


const RightSwipeActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, onDelete: () => void) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity
      onPress={onDelete}
      className="bg-primary justify-center gap-2 items-center flex h-full px-4">
      <Ionicons name="trash-outline" color="white" size={24}/>
      <Animated.Text
        style={{
          color: "#fff",
          fontWeight: "600",
          fontSize: 14,
          transform: [{ scale }],
        }}>
            DELETE
      </Animated.Text>
    </TouchableOpacity>
  );
};

const CategoryListItem = ({
  id,
  name,
  mcId,
  code,
  group,
  mc,
  mc_name,
  status,
}: Items) => {
  const swipeableRef = useRef<Swipeable>(null);
  // const [imageError, setImageError] = useState(false);
  // const imageSource = imageError || !photo ? productPhoto : { uri: photo };
  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel", onPress: () => swipeableRef.current?.close() },
      { text: "Delete", style: "destructive", onPress: () => console.log(`Deleting item: ${id}`) },
    ]);
  };

  // console.log("PHOTO",
  //   name,
  //   mcId || "no mcId",
  //   code,
  //   group,
  //   mc || "no mc",
  //   mc_name || "no mc_name",
  // )

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={(progress, dragX) => RightSwipeActions(progress, dragX, handleDelete)}
      leftThreshold={100}
      rightThreshold={100}
      onSwipeableOpen={(direction) => {
        if (direction === "right") {
          console.log("Swiped right");
        }
      }}>

      <TouchableOpacity onPress={() => router.push({pathname:`/category/${id}`, params:{isCat: mc ? "sub_category" : "category"}})} 
        className="px-4 py-4 m-2 flex flex-row gap-4 justify-between bg-white border-slate-200 border rounded-xl shadow-sm">
          <MaterialIcons name="category" size={50} color="#B6B6B6" />
        <View className="flex-1 flex gap-2 justify-between">
          <View className="flex flex-row justify-between gap-2 items-start">
            <Text className="text-xl font-pmedium flex-1">{name}</Text>
            <Text className="text-lg font-pmedium">Code: {code}</Text>
          </View>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-md font-pregular">Group: {group}</Text>
            <View className="flex flex-row justify-end items-center gap-2">
              
            {mc_name || name ? (
              <Text className="text-md font-pregular">
                {mc_name||"parent"}
              </Text>
              ) : (
                <Text className="text-md font-pregular">No category</Text>
              )}
              <Text className="text-md font-pregular">
                | {status}
              </Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default CategoryListItem;
