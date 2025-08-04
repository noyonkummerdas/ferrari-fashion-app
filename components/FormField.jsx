import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <Text className="text-lg text-gray-400 mb-2 font-regular">{title}</Text>
      <View className="w-full h-14 px-4 py-3 bg-black-200  border border-black-200 rounded-full focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-gray-400 font-pregular text-base bg-black-200"
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
            <Ionicons
              name={!showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#797979"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
