import { useGlobalContext } from "@/context/GlobalProvider";
import { useProductQuery } from "@/store/api/productApi";
import { clearError, clearSuccess, resetStockItem, setStockItem } from "@/store/slice/stockSlice";
import { RootState } from "@/store/store";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const StockDetails = () => {
  const { id } = useLocalSearchParams();
  const { userInfo } = useGlobalContext();
  

  const dispatch = useDispatch();
  const pathname = usePathname();

  // Redux selectors
  const { stockItem, isLoading, error, success, successMessage } = useSelector(
    (state: RootState) => state.stock,
  );
  // console.log("Stock Item from Redux:", stockItem);


  const {
    data,
    error: productError,
    isLoading: productLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useProductQuery({
    _id: id,
    forceRefetch: true,
  });

  useEffect(() => {
    refetch();
  }, [id, pathname]);

  useEffect(() => {
    refetch();
  }, []);
useEffect(() => {
  dispatch(resetStockItem());
  dispatch(clearError())
  dispatch(clearSuccess())
}, []);

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(
        setStockItem({
          product: id as string,
          type: "",
          status: "active",
          user: userInfo.id,
          warehouse: userInfo.warehouse,
        }),
      );
    }
  }, [data, isSuccess]);

  console.log("STOCK ITEM FROM REDUX:", data?.stock);

  const productImage = require("../../../../assets/images/product.jpg");
  let handleEdit ;
 if(userInfo.type === "admin"){
   handleEdit = () => {
    router.push(`/(drawer)/(tabs)/(stock)/update/${data?._id}`);
  };
}

  // Stock operation functions
  const handleStockIn = () => {
    console.log("Opening Stock In");
    // setModalType("stockIn");
    // dispatch(setStockType("stockIn"));
    dispatch(
      setStockItem({
        stock: 0,
        note: "",
        type: "stockIn",
      }),
    );
    router.push(`/(drawer)/(tabs)/(stock)/stock-in?id=${id}`);
  };

  const handleStockOut = () => {
    console.log("Opening Stock Out");
    // setModalType("stockOut");
    // dispatch(setStockType("stockOut"));
    dispatch(
      setStockItem({
        stock: 0,
        note: "",
        type: "stockOut",
      }),
    );
    router.push(`/(drawer)/(tabs)/(stock)/stock-out?id=${id}`);
  };
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {/* Back Button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          className="bg-white/90 p-3 rounded-full shadow-lg"
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Edit Button */}
      <View className="absolute top-12 right-4 z-10">
        <TouchableOpacity
          className="bg-white/90 p-3 rounded-full shadow-lg"
          onPress={handleEdit}
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Product Image Section - Square */}
      <View className="bg-gray-100 w-full aspect-square">
        <Image
          source={productImage}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Product Info Section */}
      <View className="bg-black flex-1 px-6 pt-8">
        {/* Success/Error Messages */}

        {/* Title */}
        <Text className="text-white text-2xl font-pbold mb-8">
          Style: {data?.style}
        </Text>

        {/* Stock and Code Info */}
        <View className="flex-row justify-between mb-8">
          {/* Stock Section */}
          <View className="flex-1 mr-6">
            <Text className="text-yellow-500 text-lg font-pmedium mb-4">
              Stock
            </Text>
            <View className="flex-row items-center mb-3">
              <MaterialIcons
                name="inventory"
                size={24}
                color="#FDB714"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white text-2xl font-pbold items-center">
                {data?.currentStock || 0}
              </Text>
            </View>
          </View>

          {/* Code Section */}
          <View className="flex-1 ml-6">
            <View className="flex-row items-center mb-3">
              <Text className="text-yellow-500 text-lg font-pmedium">Code</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons
                name="qr-code"
                size={24}
                color="#FDB714"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white text-2xl font-pbold">
                {data?.code}
              </Text>
            </View>
          </View>
        </View>

        {/* Stock History */}
       
          {data?.stock.length > 0 && (
            data?.stock.map((item) => (
              <View key={item._id} className="flex flex-row justify-between items-center">
                <Text className="text-white text-lg">{item.warehouse.name}</Text>
                <Text className="text-white text-lg">{item.currentStock}</Text>
              </View>
            ))
          )}

        {/* Bottom Action Buttons */}
        <View className="absolute bottom-0 left-0 right-0 bg-black px-6 pb-8">
          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              className="flex-1 bg-primary p-4 rounded-lg flex-row items-center justify-center"
              onPress={handleStockIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color="#000000" />
              <Text className="text-black font-pbold ml-2">
                {isLoading ? "Loading..." : "Stock In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-primary p-4 rounded-lg flex-row items-center justify-center"
              onPress={handleStockOut}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons name="remove" size={20} color="#000000" />
              <Text className="text-black font-pbold ml-2">
                {isLoading ? "Loading..." : "Stock Out"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* StockModal is no longer rendered here */}
    </View>
  );
};

export default StockDetails;
