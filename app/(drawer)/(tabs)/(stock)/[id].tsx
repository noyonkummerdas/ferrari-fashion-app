import { useGlobalContext } from "@/context/GlobalProvider";
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
  const { userInfo } = useGlobalContext();

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductQuery({
      _id: id,
    });

  const [stockItem, setStockItem] = useState({
    product: id,
    stock: 0,
    note: "",
    openingStock: 0,
    type: "",
    status: "active",
    currentStock: 0,
    user: userInfo.id,
    warehouse: userInfo.warehouse,
  });
  // console.log("Stock:", data);

  useEffect(() => {
    console.log("Stock:", stockItem);
    refetch();
  }, [id]);

  useEffect(() => {
    setStockItem({
      ...stockItem,
      product: id,
      openingStock: data?.currentStock || 0,
      currentStock: data?.currentStock || 0,
      type: "",
      status: "active",
      user: userInfo.id,
      warehouse: userInfo.warehouse,
    });
  }, [data, isSuccess]);

  const productImage = require("../../../../assets/images/product.jpg");

  const handleEdit = () => {
    router.push(`/(drawer)/(tabs)/(stock)/update/${data?._id}`);
  };

  const handleAddStock = () => {
    if (!stockItem.stock || stockItem.stock <= 0) {
      Alert.alert("Error", "Please enter a valid stock quantity");
      return;
    }
    if (!stockItem.note.trim()) {
      Alert.alert("Error", "Please enter a note");
      return;
    }

    console.log("Adding stock:", stockItem);
    // Here you can add API call to update stock
    setShowAddDialog(false);
    setStockItem((prev) => ({
      ...prev,
      stock: 0,
      note: "",
      currentStock: data?.currentStock || 0,
    }));
  };

  const handleRemoveStock = () => {
    if (!stockItem.stock || stockItem.stock <= 0) {
      Alert.alert("Error", "Please enter a valid stock quantity");
      return;
    }
    if (!stockItem.note.trim()) {
      Alert.alert("Error", "Please enter a note");
      return;
    }

    console.log("Removing stock:", stockItem);
    // Here you can add API call to update stock
    setShowRemoveDialog(false);
    setStockItem((prev) => ({
      ...prev,
      stock: 0,
      note: "",
      currentStock: data?.currentStock || 0,
    }));
  };

  const StockDialog = React.memo(
    ({
      visible,
      onClose,
      onConfirm,
      title,
      buttonText,
      buttonColor,
      stockItem,
      setStockItem,
    }: any) => {
      const [localStock, setLocalStock] = useState(0);
      const [localNote, setLocalNote] = useState("");
      const [localCurrentStock, setLocalCurrentStock] = useState(0);

      // Update local state when modal opens
      React.useEffect(() => {
        if (visible) {
          setLocalStock(stockItem.stock);
          setLocalNote(stockItem.note);
          setLocalCurrentStock(stockItem.currentStock);
        }
      }, [visible]);

      const handleStockChange = (value: string) => {
        const stockValue = parseInt(value) || 0;
        setLocalStock(stockValue);

        if (stockItem.type === "stockIn") {
          const currentStock =
            parseInt((data?.currentStock || 0).toString()) || 0;
          const newStock = currentStock + stockValue;
          setLocalCurrentStock(newStock);
        } else {
          const currentStock =
            parseInt((data?.currentStock || 0).toString()) || 0;
          const newStock = Math.max(0, currentStock - stockValue);
          setLocalCurrentStock(newStock);
        }
      };

      const handleNoteChange = (value: string) => {
        setLocalNote(value);
      };

      const handleConfirm = () => {
        // Update the global state only when confirming
        setStockItem((prev: any) => ({
          ...prev,
          stock: localStock,
          note: localNote,
          currentStock: localCurrentStock,
        }));
        onConfirm();
      };

      return (
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
                  value={localStock.toString()}
                  onChangeText={handleStockChange}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  autoFocus={true}
                />
                <Text className="text-gray-400 mb-2">Note:</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  className="border border-gray-600 bg-black-200 rounded-lg p-4 text-base text-left text-white min-h-[100px]"
                  value={localNote}
                  onChangeText={handleNoteChange}
                  placeholder="Enter your note here..."
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-700 p-4 rounded-lg"
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 ${buttonColor} p-4 rounded-lg`}
                  onPress={handleConfirm}
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
    },
  );

  StockDialog.displayName = "StockDialog";

  const handleAddModal = () => {
    setShowAddDialog(true);
    setStockItem((prev) => ({ ...prev, type: "stockIn", stock: 0, note: "" }));
  };

  const handleRemoveModal = () => {
    setShowRemoveDialog(true);
    setStockItem((prev) => ({ ...prev, type: "stockOut", stock: 0, note: "" }));
  };

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
              onPress={handleAddModal}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color="#000000" />
              <Text className="text-black font-pbold ml-2">Stock In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-primary p-4 rounded-lg flex-row items-center justify-center"
              onPress={handleRemoveModal}
              activeOpacity={0.8}
            >
              <MaterialIcons name="remove" size={20} color="#000000" />
              <Text className="text-black font-pbold ml-2">Stock Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Add Stock Dialog */}
      <StockDialog
        visible={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setStockItem((prev) => ({ ...prev, stock: 0, note: "" }));
        }}
        onConfirm={handleAddStock}
        title="Stock In"
        buttonText="Add"
        buttonColor="bg-primary"
        stockItem={stockItem}
        setStockItem={setStockItem}
      />

      {/* Remove Stock Dialog */}
      <StockDialog
        visible={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setStockItem((prev) => ({ ...prev, stock: 0, note: "" }));
        }}
        onConfirm={handleRemoveStock}
        title="Stock Out"
        buttonText="Remove"
        buttonColor="bg-primary"
        stockItem={stockItem}
        setStockItem={setStockItem}
      />
    </View>
  );
};

export default StockDetails;
