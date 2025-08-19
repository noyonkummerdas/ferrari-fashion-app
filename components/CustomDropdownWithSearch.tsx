import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownWithSearchProps {
  data: DropdownItem[];
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}

const CustomDropdownWithSearch: React.FC<CustomDropdownWithSearchProps> = ({
  data,
  value,
  placeholder,
  onValueChange,
  onSearchChange,
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<DropdownItem[]>(data);

  const selectedItem = data.find((item) => item.value === value);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData(data);
      onSearchChange("all");
    } else {
      const filtered = data.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
      onSearchChange(query);
    }
  };

  const handleSelect = (item: DropdownItem) => {
    onValueChange(item.value);
    setIsOpen(false);
    setSearchQuery("");
    setFilteredData(data);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery("");
    setFilteredData(data);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
    setFilteredData(data);
  };

  return (
    <View>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        className="flex-row justify-between items-center border border-black-200 bg-black-200 rounded-lg p-4 min-h-14"
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text
          className={`text-white text-base flex-1 ${
            !selectedItem ? "text-gray-400" : ""
          }`}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-5">
          <View className="bg-black-200 rounded-2xl w-full max-h-[80%] border border-black-200">
            {/* Header */}
            <View className="flex-row justify-between items-center p-5 border-b border-gray-600">
              <Text className="text-white text-lg font-bold">
                Select Option
              </Text>
              <TouchableOpacity onPress={handleClose} className="p-1">
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="mx-5 mt-0 mb-5 flex-row items-center border border-gray-600 bg-gray-900 rounded-lg px-3">
              <Ionicons
                name="search"
                size={20}
                color="#9CA3AF"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-white text-base py-3"
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder={searchPlaceholder}
                placeholderTextColor="#9CA3AF"
                autoFocus={true}
              />
            </View>

            {/* Options List */}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.value}
              className="max-h-[300px]"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row justify-between items-center p-4 border-b border-gray-600 ${
                    item.value === value ? "bg-gray-600" : ""
                  }`}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-white text-base flex-1 ${
                      item.value === value
                        ? "text-yellow-400 font-semibold"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color="#FDB714" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="p-5 items-center">
                  <Text className="text-gray-400 text-base">
                    No options found
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdownWithSearch;
