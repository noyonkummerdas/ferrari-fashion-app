import { useProductQuery } from "@/store/api/productApi";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const StockDetails = () => {
  const { id } = useLocalSearchParams();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [stockInput, setStockInput] = useState("");

  const [stockItem, setStockItem] = useState({
    id: id,
    name: "Polo Shirt",
    style: "Hoodi",
    code: "AB0323",
    stock: "12345",
  });

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductQuery({
      _id: id,
    });

  useEffect(() => {
    refetch();
  }, [id]);

  // console.log("PRODUCT", id, data, error, isLoading, isFetching, isSuccess);

  const productImage = require("../../../../assets/images/product.jpg");

  const handleEdit = () => {
    router.push(`/(drawer)/(tabs)/(stock)/update/${data?._id}`);
  };

  const handleAddStock = () => {
    if (!stockInput.trim()) {
      Alert.alert("Error", "Please enter a valid stock quantity");
      return;
    }

    const currentStock = parseInt(stockItem.stock) || 0;
    const addAmount = parseInt(stockInput) || 0;
    const newStock = currentStock + addAmount;

    setStockItem((prev) => ({ ...prev, stock: newStock.toString() }));
    setStockInput("");
    setShowAddDialog(false);

    // console.log("=== ADD STOCK ===");
    // console.log("Stock ID:", stockItem.id);
    // console.log("Added Amount:", addAmount);
    // console.log("Previous Stock:", currentStock);
    // console.log("New Stock:", newStock);
    // console.log("=================");
  };

  const handleRemoveStock = () => {
    if (!stockInput.trim()) {
      Alert.alert("Error", "Please enter a valid stock quantity");
      return;
    }

    const currentStock = parseInt(stockItem.stock) || 0;
    const removeAmount = parseInt(stockInput) || 0;
    const newStock = Math.max(0, currentStock - removeAmount);

    setStockItem((prev) => ({ ...prev, stock: newStock.toString() }));
    setStockInput("");
    setShowRemoveDialog(false);

    // console.log("=== REMOVE STOCK ===");
    // console.log("Stock ID:", data?._id);
    // console.log("Removed Amount:", removeAmount);
    // console.log("Previous Stock:", currentStock);
    // console.log("New Stock:", newStock);
    // console.log("====================");
  };

  const StockDialog = ({
    visible,
    onClose,
    onConfirm,
    title,
    buttonText,
    buttonColor,
  }: any) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center p-6">
        <View className="bg-black-200 rounded-2xl p-6 w-full max-w-sm border border-gray-600">
          <Text className="text-white text-xl font-bold mb-4 text-center">
            {title}
          </Text>

          <View className="mb-6">
            <Text className="text-gray-400 mb-2">Enter quantity:</Text>
            <TextInput
              className="border border-gray-600 bg-black rounded-lg p-4 text-lg text-center text-white"
              value={stockInput}
              onChangeText={setStockInput}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              autoFocus={true}
            />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-700 p-4 rounded-lg"
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 ${buttonColor} p-4 rounded-lg`}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text className="text-black font-bold text-center">
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header Buttons */}
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
                {data?.openingStock}
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
              onPress={() => setShowAddDialog(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color="#000000" />
              <Text className="text-black font-pbold ml-2">Add Stock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-primary p-4 rounded-lg flex-row items-center justify-center"
              onPress={() => setShowRemoveDialog(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="remove" size={20} color="#000000" />
              <Text className="text-black font-pbold ml-2">Remove Stock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Add Stock Dialog */}
      <StockDialog
        visible={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setStockInput("");
        }}
        onConfirm={handleAddStock}
        title="Add Stock"
        buttonText="Add"
        buttonColor="bg-primary"
      />

      {/* Remove Stock Dialog */}
      <StockDialog
        visible={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setStockInput("");
        }}
        onConfirm={handleRemoveStock}
        title="Remove Stock"
        buttonText="Remove"
        buttonColor="bg-primary"
      />
    </View>
  );
};

export default StockDetails;
