import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";

interface CustomDrawerToggleButtonProps {
  tintColor?: string;
}

// Custom drawer toggle button with color control
const CustomDrawerToggleButton: React.FC<CustomDrawerToggleButtonProps> = ({
  tintColor = "#ffffff",
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}
      activeOpacity={0.7}
    >
      <Ionicons name="menu" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};

export default CustomDrawerToggleButton;
