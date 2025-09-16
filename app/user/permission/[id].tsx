import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useUpdateUserMutation } from "@/store/api/userApi";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";

// Types
type SubModule = { id: string; name: string };
type Module = { name: string; subModules: SubModule[] };
type Permission = { canView: boolean; canEdit: boolean; canDelete: boolean; canCreate: boolean };

// Default permission
const defaultPerm: Permission = {
  canView: false,
  canEdit: false,
  canDelete: false,
  canCreate: false,
};

// Modules + SubModules
const modules: Module[] = [
  { name: "Stock", subModules: [{ id: "s1", name: "Stock In" }, { id: "s2", name: "Stock Out" }] },
  {
    name: "Accounts",
    subModules: [
      { id: "a1", name: "Cash In" },
      { id: "a2", name: "Cash Out" },
      { id: "a3", name: "Payment" },  
      { id: "a4", name: "Payment Received" },
    ],
  },
  { name: "Suppliers", subModules: [{ id: "sp1", name: "Supplier List" }] },
  { name: "Customers", subModules: [{ id: "c1", name: "Customer List" }] },
  { name: "Sales", subModules: [{ id: "sa1", name: "Sales Invoice" }] },
  { name: "Purchases", subModules: [{ id: "p1", name: "Purchase Invoice" }] },
  { name: "Users", subModules: [{ id: "u1m", name: "User Management" }] },
  { name: "Reports", subModules: [{ id: "r1", name: "Report View" }] },
];

// Example fallback permissions (when API not available)
const fallbackPermissions: { [subModuleId: string]: Permission } = {
  s1: { canView: true, canEdit: false, canDelete: false, canCreate: true },
  s2: { canView: true, canEdit: false, canDelete: false, canCreate: true },
  a1: { canView: true, canEdit: false, canDelete: false, canCreate: true },
  a2: { canView: true, canEdit: false, canDelete: false, canCreate: true },
  a3: { canView: true, canEdit: false, canDelete: false, canCreate: true },
  a4: { canView: true, canEdit: false, canDelete: false, canCreate: true },
  sp1: { canView: true, canEdit: true, canDelete: false, canCreate: false },
  c1: { canView: true, canEdit: true, canDelete: false, canCreate: false },
  sa1: { canView: true, canEdit: true, canDelete: false, canCreate: true },
  p1: { canView: true, canEdit: true, canDelete: false, canCreate: true },
  u1m: { canView: true, canEdit: true, canDelete: false, canCreate: false },
  r1: { canView: true, canEdit: true, canDelete: false, canCreate: false },
};

export default function PermissionsScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { userInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const [selectedUser, setSelectedUser] = useState<string | null>('id');
  const [permissions, setPermissions] = useState<{ [subModuleId: string]: Permission }>({});
  const [moduleChecked, setModuleChecked] = useState<{ [moduleName: string]: boolean }>({});


  // ✅ RTK Query mutation hook
  const [updateUser, {data, isError, isLoading, isSuccess }] = useUpdateUserMutation();
  // console.log('updateUser' , data)
  console.log("isLoading:", isLoading);
console.log("isSuccess:", isSuccess);
console.log("isError:", isError);
console.log("data:", data);


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
          <Text className="text-gray-200 border border-gray-600 p-2 rounded-lg">
            {isLoading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, permissions, isLoading]);

  // Load permissions for user
  useEffect(() => {
    if (!selectedUser) return;

    const permObj: { [subModuleId: string]: Permission } = {};
    const modCheckedObj: { [moduleName: string]: boolean } = {};

    modules.forEach((mod) => {
      let allChecked = true;
      mod.subModules.forEach((sub) => {
        permObj[sub.id] = fallbackPermissions[sub.id] || { ...defaultPerm };
        if (!permObj[sub.id].canView) allChecked = false;
      });
      modCheckedObj[mod.name] = allChecked;
    });

    setPermissions(permObj);
    setModuleChecked(modCheckedObj);
  }, [selectedUser]);

  const togglePermission = (subModuleId: string, key: keyof Permission, value: boolean) => {
    setPermissions((prev) => {
      const prevPerm = prev[subModuleId] || { ...defaultPerm };
      const updated = { ...prev, [subModuleId]: { ...prevPerm, [key]: value } };

      // Update module checkbox
      modules.forEach((mod) => {
        if (mod.subModules.some((sub) => sub.id === subModuleId)) {
          const allSubChecked = mod.subModules.every((sub) => updated[sub.id]?.canView);
          setModuleChecked((prevMod) => ({ ...prevMod, [mod.name]: allSubChecked }));
        }
      });

      return updated;
    });
  };

  const toggleModule = (mod: Module) => {
    const newValue = !moduleChecked[mod.name];
    setPermissions((prev) => {
      const updated = { ...prev };
      mod.subModules.forEach((sub) => {
        if (!updated[sub.id]) updated[sub.id] = { ...defaultPerm };
        updated[sub.id].canView = newValue;
      });
      return updated;
    });
    setModuleChecked((prev) => ({ ...prev, [mod.name]: newValue }));
  };

  // ✅ Save permissions via RTK Query
  async function savePermissions() {
    if (!selectedUser) return Alert.alert("Error", "Please select a user.");

    try {
      const res= await updateUser({
        id: selectedUser,
        permissions: permissions,
      }).unwrap();
      console.log('Mutation response:' , res)

      Alert.alert("Success", "Permissions saved successfully!");
      console.log("Saved Permissions:", permissions);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  }

  return (
    <View className="flex-1 p-4 bg-dark">
      <ScrollView>
        {modules.map((mod) => (
          <View key={mod.name} className="mb-4">
            <View className="flex-row justify-between items-center mb-2 border-b border-gray-600 pb-1">
              <View className="flex-row gap-3 items-center">
                <Checkbox
                  value={moduleChecked[mod.name] || false}
                  onValueChange={() => toggleModule(mod)}
                  color={moduleChecked[mod.name] ? "#fdb714" : undefined}
                />
                <Text className="text-yellow-400 text-xl font-bold">{mod.name}</Text>
              </View>
              <View className="flex-row gap-3 items-center text-center">
                <Text className="text-white text-lg">View</Text>
                <Text className="text-white text-lg">Create</Text>
                <Text className="text-white text-lg">Edit</Text>
                <Text className="text-white text-lg">Delete</Text>
              </View>
            </View>

            {mod.subModules.map((sub) => {
              const perm = permissions[sub.id] || { ...defaultPerm };
              return (
                <View
                  key={sub.id}
                  className="flex-row justify-between items-center p-2 border-b border-gray-600 w-full"
                >
                  <Text className="text-white text-lg">{sub.name}</Text>
                  <View className="flex-row gap-3 w-[45%] items-center justify-between">
                    <Checkbox
                      value={perm.canView}
                      onValueChange={(v) => togglePermission(sub.id, "canView", v)}
                      color={perm.canView ? "#fdb714" : undefined}
                    />
                    <Checkbox
                      value={perm.canCreate}
                      onValueChange={(v) => togglePermission(sub.id, "canCreate", v)}
                      color={perm.canCreate ? "#fdb714" : undefined}
                    />
                    <Checkbox
                      value={perm.canEdit}
                      onValueChange={(v) => togglePermission(sub.id, "canEdit", v)}
                      color={perm.canEdit ? "#fdb714" : undefined}
                    />
                    <Checkbox
                      value={perm.canDelete}
                      onValueChange={(v) => togglePermission(sub.id, "canDelete", v)}
                      color={perm.canDelete ? "red" : undefined}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
