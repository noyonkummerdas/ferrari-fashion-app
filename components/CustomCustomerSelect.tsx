import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useCustomersQuery } from '@/store/api/searchApi';
import { Ionicons } from '@expo/vector-icons';
import { selcetCustomer } from '@/store/slice/posSlice';
import { useDispatch, useSelector } from 'react-redux';

// interface UserInfo {
//   aamarId?: string;
//   warehouse?: string;
// }

interface Customer {
  _id: string;
  name: string;
  phone: string;
  membership: string;
  type: string;
  point: string;
  status: string;
}

interface SelectCustomerProps {
  onSelect: (item: Customer) => void;
  focuse: boolean;
  setFocuse: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectCustomer: React.FC<SelectCustomerProps> = ({ onSelect, focuse, setFocuse }) => {
  const { userInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const [selectedItem, setSelectedItem] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('default');
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const limit = 5;

  const dispatch = useDispatch()
  // const posData = useSelector(state=>state.pos)

  const { data: items, isSuccess, error, refetch } = useCustomersQuery({
    aamarId,
    warehouse,
    customer:searchQuery,
    limit,
    forceRefetch: true,
  });

  // console.log(selectedItem)
  const multiSelectRef = useRef<MultiSelect | null>(null);

  useEffect(() => {
    if (searchQuery) {
      // console.log(searchQuery);
      refetch();
    }
  }, [searchQuery]);

  const handleSelect = (item: Customer) => {
    setSelectedItem([item]);
    onSelect(item);
    setFocuse(false);
    setIsDropdownVisible(false);
    setSearchQuery("default")
    const customer = {
      customerId: item._id,
      point: item.point,
      phone: item.phone,
      name: item.name,
      group: item.type
    }
    dispatch(selcetCustomer(customer))
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

  const renderCustomItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className="flex p-3 border-b border-gray-300 justify-between"
    >
      <View className="flex flex-row justify-between items-start gep-2">
        <Text className="text-lg flex-1 font-bold">{item.name}</Text>
        <Text className="text-primary text-lg font-pregular">{item.phone}</Text>
      </View>
      {/* <View className="flex flex-row justify-between items-center">
        <Text className="text-gray-500">EAN: {item.ean}</Text>
        <Text className="font-semibold">Stock: {item.stock}</Text>
      </View> */}
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
        selectedItems={[{_id:selectedItem?._id, name:selectedItem?.name}]}
        selectText="Search Customer"
        searchInputPlaceholderText="Search..."
        onChangeInput={setSearchQuery}
        itemTextColor="#000"
        displayKey="name"
        noItemsText="No Customer Found"
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

export default SelectCustomer;
