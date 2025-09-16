import { useUpdateUserMutation, useUserQuery } from "@/store/api/userApi";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

type PermissionKey = 'visable' | 'view' | 'create' | 'edit' | 'delete';

type ModulePermission = Record<PermissionKey, boolean>;

type PermissionsState = Record<string, ModulePermission>;

export default function PermissionsScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams() as { id: string };

  const { data: userData, isSuccess, refetch: userDataRefetch } = useUserQuery({ _id: id });

  const [permissions, setPermissions] = useState<PermissionsState>({
    stock: { visable: true, view: true, create: true, edit: false, delete: false },
    accounts: { visable: true, view: true, create: true, edit: false, delete: false },
    suppliers: { visable: true, view: true, create: false, edit: true, delete: false },
    customers: { visable: true, view: true, create: false, edit: true, delete: false },
    sales: { visable: true, view: true, create: true, edit: true, delete: false },
    purchases: { visable: true, view: true, create: true, edit: true, delete: false },
    users: { visable: true, view: true, create: true, edit: true, delete: false },
    reports: { visable: true, view: true, create: false, edit: false, delete: false },
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Fetch user permissions
  useEffect(() => {
    userDataRefetch();
  }, []);

  // Only update from server if no local changes have been made
  useEffect(() => {
    if (userData?.permissions && typeof userData.permissions === "object" && !hasLocalChanges) {
      console.log('Setting permissions from userData:', userData.permissions);
      setPermissions(userData.permissions);
    }
  }, [isSuccess, userData, hasLocalChanges]);

  // Toggle permission with proper state management
  const togglePermission = (module: string, permissionType: PermissionKey) => {
    console.log('Toggling:', module, permissionType);
    console.log('Current value:', permissions[module]?.[permissionType]);
    
    setHasLocalChanges(true); // Mark that user has made changes
    
    setPermissions((prevPermissions) => {
      // Check if module exists
      if (!prevPermissions[module]) {
        console.warn(`Module ${module} not found in permissions`);
        return prevPermissions;
      }
      
      // Check if permission type exists
      if (!(permissionType in prevPermissions[module])) {
        console.warn(`Permission ${permissionType} not found in module ${module}`);
        return prevPermissions;
      }
      
      const updatedPermissions = {
        ...prevPermissions,
        [module]: {
          ...prevPermissions[module],
          [permissionType]: !prevPermissions[module][permissionType],
        },
      };
      
      console.log(`Toggled ${module}.${permissionType}:`, 
        prevPermissions[module][permissionType], 
        '→', 
        updatedPermissions[module][permissionType]
      );
      
      return updatedPermissions;
    });
  };

  // Save API mutation
  const [updateUser] = useUpdateUserMutation();

  async function savePermissions() {
    console.log('Saving permissions:', permissions);
    
    try {
      const res = await updateUser({
        _id: id,
        permissions,
      }).unwrap();

      console.log('Save response:', res);
      setHasLocalChanges(false); // Reset local changes flag after successful save

      Alert.alert("Success", "Permissions saved successfully!");
    } catch (err: any) {
      console.error('Save error:', err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  }

  // Header layout config
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "User Permissions",
      headerStyle: { backgroundColor: "#000000" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={savePermissions} className="me-4">
          <Text className={`border px-4 py-1 rounded-lg ${
            hasLocalChanges 
              ? 'border-amber-400 text-amber-400' 
              : 'border-gray-600 text-white'
          }`}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, hasLocalChanges]);

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  const CheckBox = React.memo(({ checked }: { checked: boolean }) => {
    return (
      <View
        className={`w-6 h-6 rounded border-2 ${
          checked ? "bg-amber-400 border-amber-400" : "border-gray-400"
        } items-center justify-center`}
      >
        {checked && <MaterialIcons name="check" size={16} color="black" />}
      </View>
    );
  });

  // Debug permissions changes
  useEffect(() => {
    console.log('Permissions state updated:', permissions);
  }, [permissions]);

  return (
    <View className="flex-1 p-4 bg-dark">
      <ScrollView className="p-1">
        {Object.entries(permissions).map(([moduleKey, perms]) => (
          <View key={moduleKey} className="mb-6 border-b border-gray-700 pb-4">
            {/* Module title and visable */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-amber-400">
                {capitalize(moduleKey)}
              </Text>
              <View className="flex-row items-center space-x-2">
                <Text className="text-white text-sm mr-2">Show in Menu</Text>
                <TouchableOpacity 
                  onPress={() => {
                    console.log('Visibility toggle pressed for:', moduleKey);
                    togglePermission(moduleKey, "visable");
                  }}
                  style={{ padding: 8 }}
                  activeOpacity={0.7}
                >
                  <CheckBox checked={perms.visable} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Permission boxes */}
            <View className="flex-row justify-between px-1">
              {(["view", "create", "edit", "delete"] as PermissionKey[]).map((key) => (
                <View key={key} className="items-center w-20">
                  <Text className="text-white text-sm mb-1 capitalize">{key}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('Permission toggle pressed for:', moduleKey, key);
                      togglePermission(moduleKey, key);
                    }}
                    style={{ padding: 8 }}
                    activeOpacity={0.7}
                  >
                    <CheckBox checked={perms[key]} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Debug info - remove in production */}
      {__DEV__ && hasLocalChanges && (
        <View className="p-2 bg-gray-800 rounded">
          <Text className="text-amber-400 text-xs">
            Debug: Local changes detected
          </Text>
        </View>
      )}
    </View>
  );
}