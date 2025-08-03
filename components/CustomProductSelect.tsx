import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useProductsSearchQuery } from '@/store/api/searchApi';
import { Ionicons } from '@expo/vector-icons';

interface UserInfo {
  aamarId?: string;
  warehouse?: string;
}

interface Product {
  _id: string;
  name: string;
  priceList: { mrp: number | string }[];
  ean: string;
  stock: number;
}

interface SingleSelectProps {
  onSelect: (item: Product) => void;
  focuse: boolean;
  setFocuse: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleSelect: React.FC<SingleSelectProps> = ({ onSelect, focuse, setFocuse }) => {
  const { userInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const [selectedItem, setSelectedItem] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('default');
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);

  const { data: items, isSuccess, error, refetch } = useProductsSearchQuery({
    aamarId,
    warehouse,
    searchQuery,
    forceRefetch: true,
  });

  const multiSelectRef = useRef<MultiSelect | null>(null);

  useEffect(() => {
    if (searchQuery) {
      console.log(searchQuery);
      refetch();
    }
  }, [searchQuery]);

  const handleSelect = (item: Product) => {
    setSelectedItem([item]);
    onSelect(item);
    setFocuse(false);
    setIsDropdownVisible(false);
    setSearchQuery("default")
    multiSelectRef.current?._clearSelector();
  };

  const handleToggleDropdown = () => {
    setFocuse((preState) => !preState);
  };

  const onClear = () => {
    setSelectedItem([]);
    setSearchQuery('');
    setFocuse(false);
  };

  const renderCustomItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className="flex p-3 border-b border-gray-300 justify-between"
    >
      <View className="flex flex-row justify-between items-start gep-2">
        <Text className="text-lg flex-1 font-bold">{item.name}</Text>
        <Text className="text-primary text-lg font-semibold">${item.priceList[0]?.mrp ?? 'N/A'}</Text>
      </View>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-gray-500">EAN: {item.ean}</Text>
        <Text className="font-semibold">Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="w-full">
      <MultiSelect
        ref={multiSelectRef}
        hideTags
        single={true}
        items={items || []}
        uniqueKey="_id"
        onSelectedItemsChange={handleSelect}
        selectedItems={selectedItem}
        selectText="Search Products"
        searchInputPlaceholderText="Search..."
        onChangeInput={setSearchQuery}
        itemTextColor="#000"
        displayKey="name"
        noItemsText="No Product Found"
        searchInputStyle={{
          height: 50,
          paddingLeft: 15,
          fontSize: 16,
        }}
        styleInputGroup={{
          height: 50,
        }}
        searchIcon={<Ionicons name="search-outline" size={24} color="#f2652d" />}
        onClearSelector={onClear}
        submitButtonColor="#f2652d"
        submitButtonText="OK"
        hideSubmitButton
        flatListProps={{
          data: items,
          keyExtractor: (item) => item._id,
          renderItem: renderCustomItem,
        }}
        onToggleList={handleToggleDropdown}
        styleDropdownMenu={{
          height: isDropdownVisible ? 50 : 50,
          overflow: 'hidden',
        }}
      />
    </View>
  );
};

export default SingleSelect;
