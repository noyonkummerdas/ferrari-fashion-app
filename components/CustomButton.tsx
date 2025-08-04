import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';


type ButtonTypes = {
    title:string;
    handlePress?:any;
    containerStyles?:string;
    textStyles?:string;
    isLoading?:boolean;
}

const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
  }:ButtonTypes) => {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-primary rounded-full min-h-[55px] px-4 flex flex-row justify-center items-center ${containerStyles} ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <Text className={`text-gray-900 font-psemibold text-lg  ${textStyles}`}>
          {title}
        </Text>
  
        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
            className="ml-2"
          />
        )}
      </TouchableOpacity>
    );
}

export default CustomButton