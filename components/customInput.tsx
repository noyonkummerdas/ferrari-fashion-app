import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { ComponentType, useRef } from "react";
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownItem {
  label: string;
  value: string;
}


interface CustomProps {
  IconComponent?: ComponentType<any>;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: string;
  title?: string;
  titleStyle?: string;
  disabled?: boolean;
  inputType?: "text" | "email" | "password" | "number";
  inputStyle?: string;
  placeholder?: string;
  value?: string;
  setValue?: (text: string) => void;
  isLast?: boolean;
  isDropdown?: boolean;
  dwList?: any;
  className?:string;
}

const CustomInput: React.FC<CustomProps> = ({
  IconComponent = Ionicons,
  icon,
  iconColor = "#ff6a39",
  iconSize,
  iconStyle,
  title,
  titleStyle,
  disabled,
  inputType = "text",
  inputStyle,
  placeholder,
  value,
  setValue,
  isLast = false,
  isDropdown=false,
  dwList=[],
  className,
}) => {
  const getKeyboardType = () => {
    switch (inputType) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      default:
        return "default";
    }
  };

  const dropdownRef = useRef<any>(null);
  

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      className="flex-row w-96 justify-between items-center p-4 rounded-lg hover:bg-gray-200 border-b border-gray-300 mb-1"
      onPress={() => {
        setValue(item.value );
        if (dropdownRef.current) {
          dropdownRef.current.close(); // ✅ Programmatically close modal after select
        }
      }}
    >
      <Text className="text-base text-gray-700">{item.label}</Text>
      {item.value === value && <AntDesign name="check" size={20} color="black" />}
    </TouchableOpacity>
  );

//   console.log("DW VALUE:", value)

  return (
    <View
      className={`flex flex-row items-center justify-between px-4 py-3  bg-slate-100 
        ${isLast ? "mb-0" : "mb-2"} ${className}
      `}
    >
      {/* Left: Icon and Title */}
      <View className="flex-row items-center gap-3 w-1/3">
        <IconComponent
          name={icon || "clipboard-outline"}
          size={iconSize || 20}
          color={iconColor}
          className={`${iconStyle || ""}`}
        />
        {title && (
          <Text
            numberOfLines={1}
            className={`${titleStyle || "text-lg text-gray-500"}`}
          >
            {title}
          </Text>
        )}
      </View>
      <View>
        {
            isDropdown ? 
            <View className={`flex-1 text-lg h-14 text-end text-gray-700 ${inputStyle || ""}`}>
                <Dropdown
                    ref={dropdownRef}
                    style={{ 
                        // borderWidth: 1, 
                        // borderColor: '#d1d5db', 
                        borderRadius: 50, 
                        padding: 14,
                        paddingEnd:0,
                        minWidth:200,
                        alignItems:"flex-end",
                        justifyContent:"flex-end"
                     }}
                    placeholderStyle={{ fontSize: 16, color: '#6b7280',textAlign: 'right' }}
                    selectedTextStyle={{ fontSize: 16, color: '#000',textAlign: 'right' }}
                    inputSearchStyle={{ height: 40, fontSize: 16, color: '#000', }}
                    data={dwList}
                    search={false}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder={placeholder}
                    searchPlaceholder="Search..."
                    value={value}
                    onChange={(item: DropdownItem) => {
                        setValue(item.value);
                        if (dropdownRef.current) {
                            dropdownRef.current.close();
                        }
                    }}
                    renderItem={(item) => renderItem({ item })}
                    mode={'modal'} //default
                    closeModalWhenSelectedItem
                    containerStyle={{
                        minWidth: '94%',
                        marginVertical: 15,
                        borderRadius: 20,
                        padding: 14,
                        overflow: 'hidden',
                    }}
                />
            </View>
            :
            <TextInput
                className={`flex-1 text-lg text-end text-gray-700 ${inputStyle || ""}`}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={(text) => setValue?.(text)}
                editable={!disabled}
                secureTextEntry={inputType === "password"}
                keyboardType={getKeyboardType()}
            />
        }
      </View>
    </View>
  );
};

export default CustomInput;