import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboard, // default, number-pad, decimal-pad, numeric, email-address, phone-pad, url
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg text-black-200 mb-2 font-pmedium">{title}</Text>
      <View className="w-full h-14 px-4 py-3 bg-gray-200  border border-gray-200 rounded-full focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-black-100 h-16 font-pregular text-base bg-black-200"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#797979"
          onChangeText={handleChangeText}
          // keyboardType={keyboard === "" ? "default" : "deafult"}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              // className="w-4 h-4"
              style={{height:"22", width:"22", float:"end"}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
