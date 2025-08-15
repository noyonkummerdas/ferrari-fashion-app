import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

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
  maxNumberOfLines,
}) => {
  const dropdownRef = useRef<any>(null);

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      className="flex-row w-full justify-between items-center p-4 rounded-lg hover:bg-black-100 border-b border-black-100 mb-1"
      onPress={() => {
        setValue(item.value);
        if (dropdownRef.current && mode === "modal") {
          dropdownRef.current.close(); // ✅ Programmatically close modal after select
        }
      }}
    >
      <Text className="text-lg text-gray-200 font-regular">{item.label}</Text>
      {item.value === value && (
        <AntDesign name="check" size={20} color="#fdb714" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="w-full mb-3 mt-2">
      <Dropdown
        ref={dropdownRef}
        style={{
          borderWidth: 1,
          borderColor: "#242424",
          borderRadius: 50,
          padding: 16,
          backgroundColor: "#242424",
          height: 48,
          width: "100%",
        }}
        placeholderStyle={{
          fontSize: 18,
          color: "#6b7280",
          fontFamily: "Poppins-Regular",
        }}
        selectedTextStyle={{
          fontSize: 12,
          color: "#e5e7eb",
          fontFamily: "Poppins-Regular",
        }}
        inputSearchStyle={{
          height: 30,
          fontSize: 12,
          color: "#e5e7eb",
          backgroundColor: "#242424",
          borderWidth: 1,
          borderColor: "#374151",
          borderRadius: 8,
          paddingHorizontal: 12,
        }}
        data={data}
        search={search ?? true}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        activeColor="#374151"
        value={value}
        onChange={(item: DropdownItem) => {
          setValue(item.value);
          if (dropdownRef.current && mode === "modal") {
            dropdownRef.current.close(); // ✅ Also safe here
          }
        }}
        renderItem={(item) => renderItem({ item })}
        mode={mode ?? "modal"}
        closeModalWhenSelectedItem
        itemContainerStyle={{
          backgroundColor: "#1d1f24",
        }}
        itemTextStyle={{
          color: "#e5e7eb",
          fontSize: 18,
          fontFamily: "Poppins-Regular",
        }}
        containerStyle={{
          minWidth: "94%",
          marginVertical: 15,
          borderRadius: 12,
          padding: 14,
          overflow: "hidden",
          backgroundColor: "#1d1f24",
          borderWidth: 1,
          borderColor: "#374151",
        }}
      />
    </View>
  );
};

export default CustomDropdown;
