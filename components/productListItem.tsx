import React, { useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { router } from "expo-router";
import productPhoto from "../assets/images/product.jpg"
import { Ionicons } from "@expo/vector-icons";

interface Items {
  id:String;
  name:String;
  photo:String | null;
  ean:String;
  article_code:String;
  mrp:String;
  tp:String;
  stock:String;
  status:String;
  category_name:String; 
  master_category_name:String;  
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

const ProductItemList = ({
  id,
  name,
  photo,
  ean,
  article_code,
  mrp,
  category_name,
  master_category_name,
  tp,
  stock,
  status,
}: Items) => {
  const swipeableRef = useRef<Swipeable>(null);
  const [imageError, setImageError] = useState(false);
  const imageSource = imageError || !photo ? productPhoto : { uri: photo };
  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel", onPress: () => swipeableRef.current?.close() },
      { text: "Delete", style: "destructive", onPress: () => console.log(`Deleting item: ${id}`) },
    ]);
  };

  // console.log("PHOTO",imageSource)

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
      <TouchableOpacity onPress={() => router.push(`/product/${id}`)} className="px-4 py-4 flex flex-row gap-4 justify-between bg-white border-slate-200 border-b">
        <Image 
          className="h-20 w-20 rounded-lg" 
          source={imageSource} 
          onError={() => {
            console.log("Image failed to load:", photo); // Debugging log
            setImageError(true);
        }
        }
        />
        <View className="flex-1 flex gap-3 justify-between">
          <View className="flex flex-row justify-between gap-2 items-start">
            <Text className="text-lg font-pmedium flex-1">{name}</Text>
            <Text className="text-lg font-pmedium">$ {mrp}</Text>
          </View>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-md font-pregular">Code: {article_code}</Text>
            {master_category_name || category_name ? (
              <Text className="text-md font-pregular">
                {master_category_name} | {category_name || ""}
              </Text>
            ) : (
              <Text className="text-md font-pregular">No category</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ProductItemList;
