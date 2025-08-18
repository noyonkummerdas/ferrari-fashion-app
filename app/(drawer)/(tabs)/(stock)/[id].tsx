import { useGlobalContext } from "@/context/GlobalProvider";
import { useProductQuery } from "@/store/api/productApi";
import { useAddStockMutation } from "@/store/api/stockApi";
import {
  clearError,
  clearSuccess,
  resetStockItem,
  setError,
  setLoading,
  setStockItem,
  setStockType,
  setSuccess,
  updateCurrentStock,
  updateNote,
  updateStockQuantity,
} from "@/store/slice/stockSlice";
import { RootState } from "@/store/store";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const StockDetails = () => {
  const { id } = useLocalSearchParams();
  const { userInfo } = useGlobalContext();
  const dispatch = useDispatch();

  // Redux selectors
  const { stockItem, isLoading, error, success, successMessage } = useSelector(
    (state: RootState) => state.stock,
  );

  // API hooks
  const [addStock] = useAddStockMutation();

  const {
    data,
    error: productError,
    isLoading: productLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useProductQuery({
    _id: id,
  });

  useEffect(() => {
    refetch();
  }, [id]);

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(
        setStockItem({
          product: id as string,
          openingStock: data?.currentStock || 0,
          currentStock: data?.currentStock || 0,
          type: "",
          status: "active",
          user: userInfo.id,
          warehouse: userInfo.warehouse,
        }),
      );
    }
  }, [data, isSuccess, id, userInfo.id, userInfo.warehouse, dispatch]);

  console.log("STOCK ITEM FROM REDUX:", stockItem);

  const productImage = require("../../../../assets/images/product.jpg");

  const handleEdit = () => {
    router.push(`/(drawer)/(tabs)/(stock)/update/${data?._id}`);
  };

  // Stock operation functions
  const handleStockIn = () => {
    console.log("Opening Stock In");
    dispatch(setStockType("stockIn"));
    dispatch(
      setStockItem({
        stock: 0,
        note: "",
        currentStock: data?.currentStock || 0,
      }),
    );
    // TODO: Open modal or navigate to stock input screen
  };

  const handleStockOut = () => {
    console.log("Opening Stock Out");
    dispatch(setStockType("stockOut"));
    dispatch(
      setStockItem({
        stock: 0,
        note: "",
        currentStock: data?.currentStock || 0,
      }),
    );
    // TODO: Open modal or navigate to stock input screen
  };

  const handleUpdateStockQuantity = (quantity: number) => {
    dispatch(updateStockQuantity(quantity));
    // Calculate new current stock based on type
    if (stockItem.type === "stockIn") {
      dispatch(
        updateCurrentStock({
          baseStock: data?.currentStock || 0,
          operation: "add",
        }),
      );
    } else if (stockItem.type === "stockOut") {
      dispatch(
        updateCurrentStock({
          baseStock: data?.currentStock || 0,
          operation: "subtract",
        }),
      );
    }
  };

  const handleUpdateNote = (note: string) => {
    dispatch(updateNote(note));
  };

  const handleSubmitStock = async () => {
    if (!stockItem.stock || stockItem.stock <= 0) {
      dispatch(setError("Please enter a valid stock quantity"));
      return;
    }
    if (!stockItem.note.trim()) {
      dispatch(setError("Please enter a note"));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const stockData = {
        _id: "",
        product: id as string,
        stock: stockItem.stock,
        note: stockItem.note,
        openingStock: (data?.currentStock || 0).toString(),
        currentStock: stockItem.currentStock.toString(),
        type: stockItem.type,
        status: "active",
        user: userInfo.id,
        warehouse: userInfo.warehouse,
      };

      const result = await addStock(stockData).unwrap();
      console.log("Stock created:", result);

      dispatch(
        setSuccess({
          success: true,
          message: `Stock ${stockItem.type === "stockIn" ? "added" : "removed"} successfully!`,
        }),
      );

      // Reset stock item
      dispatch(resetStockItem());

      // Refetch product data to show updated stock
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    } catch (error) {
      console.error("Error submitting stock:", error);
      dispatch(setError("Failed to submit stock. Please try again."));
    } finally {
      dispatch(setLoading(false));
    }
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
        {success && (
          <View className="absolute top-4 left-6 right-6 z-20 bg-green-500 rounded-lg p-4 shadow-lg">
            <Text className="text-white text-center font-bold">
              {successMessage}
            </Text>
          </View>
        )}

        {error && (
          <View className="absolute top-4 left-6 right-6 z-20 bg-red-500 rounded-lg p-4 shadow-lg">
            <Text className="text-white text-center font-bold">{error}</Text>
          </View>
        )}

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
    </View>
  );
};

export default StockDetails;
