import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface SaveButtonProps {
  onPress: () => void;
  title?: string;
  className?: string; // Add className prop
  align?: 'left' | 'center' | 'right';
}

const SaveButton: React.FC<SaveButtonProps> = ({ onPress, title = 'Save', className = '', align = 'center' 
}) => {
  // Tailwind alignment classes for left, center, or right
  const alignmentClass = 
    align === 'left' ? 'justify-start' : 
    align === 'right' ? 'justify-end' : 'justify-center';
  
  return (
    <View className={`flex flex-row ${alignmentClass} w-full`}>
    <TouchableOpacity
      onPress={onPress}
      className={`bg-primary h-12 justify-center flex rounded-full items-center mt-2 w-full ${className}`} // Apply custom className
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
    </View>
  );
};

export default SaveButton;
