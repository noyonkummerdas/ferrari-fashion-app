import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  data: DropdownItem[];
  value: string;
  placeholder: string;
  mode: "modal" | "auto" | "default" | undefined;
  setValue: (value: string) => void;
  search?: boolean;
  maxNumberOfLines?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  data, 
  value, 
  setValue, 
  placeholder,
  mode, 
  search, 
  maxNumberOfLines 
}) => {
  const dropdownRef = useRef<any>(null);

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      className="flex-row w-96 justify-between items-center p-4 rounded-lg hover:bg-gray-200 border-b border-gray-300 mb-1"
      onPress={() => {
        setValue(item.value);
        if (dropdownRef.current && mode === 'modal') {
          dropdownRef.current.close(); // ✅ Programmatically close modal after select
        }
      }}
    >
      <Text className="text-base text-gray-700">{item.label}</Text>
      {item.value === value && <AntDesign name="check" size={20} color="black" />}
    </TouchableOpacity>
  );

  return (
    <View className="m-4 bg-white w-full rounded-full shadow mb-3">
      <Dropdown
        ref={dropdownRef}
        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 50, padding: 14 }}
        placeholderStyle={{ fontSize: 16, color: '#6b7280' }}
        selectedTextStyle={{ fontSize: 16, color: '#000' }}
        inputSearchStyle={{ height: 40, fontSize: 16, color: '#000' }}
        data={data}
        search={search ?? true}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item: DropdownItem) => {
          setValue(item.value);
          if (dropdownRef.current && mode === 'modal') {
            dropdownRef.current.close(); // ✅ Also safe here
          }
        }}
        renderItem={(item) => renderItem({ item })}
        mode={mode ?? 'modal'}
        closeModalWhenSelectedItem
        containerStyle={{
          minWidth: '94%',
          marginVertical: 15,
          borderRadius: 12,
          padding: 14,
          overflow: 'hidden'
        }}
      />
    </View>
  );
};

export default CustomDropdown;
