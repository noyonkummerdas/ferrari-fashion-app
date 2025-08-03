import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2 ">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default InputField;
