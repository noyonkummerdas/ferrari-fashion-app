import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

// Types
type User = { id: string; name: string; role: "admin" | "user" };
type SubModule = { id: string; name: string };
type Module = { name: string; subModules: SubModule[] };
type Permission = { canView: boolean; canEdit: boolean; canDelete: boolean };

// Dummy Users
const users: User[] = [
  { id: "u1", name: "Admin User", role: "admin" },
  { id: "u2", name: "Normal User", role: "user" },
];

// Modules + SubModules
const modules: Module[] = [
  { name: "Stock", subModules: [{ id: "s1", name: "Stock In" }, { id: "s2", name: "Stock Out" }] },
  { name: "Accounts", subModules: [
    { id: "a1", name: "Cash In" },
    { id: "a2", name: "Cash Out" },
    { id: "a2", name: "payment" },
    { id: "a3", name: "Payment Received" },
  ]},
  { name: "Suppliers", subModules: [{ id: "sp1", name: "Supplier List" }]},
  { name: "Customers", subModules: [{ id: "c1", name: "Customer List" }]},
  { name: "Sales", subModules: [{ id: "sa1", name: "Sales Invoice" }]},
  { name: "Purchases", subModules: [{ id: "p1", name: "Purchase Invoice" }]},
  { name: "Users", subModules: [{ id: "u1m", name: "User Management" }]},
  { name: "Reports", subModules: [{ id: "r1", name: "Report View" }]},
];

// Example fetched permissions (dummy)
const fetchedPermissions: { [userId: string]: { [subModuleId: string]: Permission } } = {
  u1: { s1: { canView: true, canEdit: true, canDelete: false }, a1: { canView: true, canEdit: true, canDelete: false } },
  u2: { s2: { canView: true, canEdit: false, canDelete: false }, r1: { canView: true, canEdit: false, canDelete: false } },
};

export default function PermissionsScreen() {
  const navigation = useNavigation();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<{ [subModuleId: string]: Permission }>({});
  const [moduleChecked, setModuleChecked] = useState<{ [moduleName: string]: boolean }>({});

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
          <Text className="text-gray-200 border border-gray-600 p-2 rounded-lg">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedUser, permissions]);

  // Load permissions when user changes
  useEffect(() => {
    if (!selectedUser) return;

    const userPerms = fetchedPermissions[selectedUser] || {};
    const permObj: { [subModuleId: string]: Permission } = {};
    const modCheckedObj: { [moduleName: string]: boolean } = {};

    modules.forEach((mod) => {
      let allChecked = true;
      mod.subModules.forEach((sub) => {
        // Always ensure submodule exists in permissions
        permObj[sub.id] = userPerms[sub.id] || { canView: false, canEdit: false, canDelete: false };
        if (!permObj[sub.id].canView) allChecked = false;
      });
      modCheckedObj[mod.name] = allChecked;
    });

    setPermissions(permObj);
    setModuleChecked(modCheckedObj);
  }, [selectedUser]);

  const togglePermission = (subModuleId: string, key: keyof Permission, value: boolean) => {
    setPermissions((prev) => {
      const prevPerm = prev[subModuleId] || { canView: false, canEdit: false, canDelete: false, canCreate: false };
      const updated = { ...prev, [subModuleId]: { ...prevPerm, [key]: value } };

      // Update main module checkbox if key === canView
      if (key === "canView") {
        modules.forEach((mod) => {
          if (mod.subModules.some((sub) => sub.id === subModuleId)) {
            const allSubChecked = mod.subModules.every((sub) => updated[sub.id]?.canView);
            setModuleChecked((prevMod) => ({ ...prevMod, [mod.name]: allSubChecked }));
          }
        });
      }

      return updated;
    });
  };

  const toggleModule = (mod: Module) => {
    const newValue = !moduleChecked[mod.name];
    setPermissions((prev) => {
      const updated = { ...prev };
      mod.subModules.forEach((sub) => {
        if (!updated[sub.id]) updated[sub.id] = { canView: false, canEdit: false, canDelete: false };
        updated[sub.id].canView = newValue;
      });
      return updated;
    });
    setModuleChecked((prev) => ({ ...prev, [mod.name]: newValue }));
  };

  function savePermissions() {
    if (!selectedUser) return Alert.alert("Error", "Please select a user.");
    console.log("Saving permissions for user:", selectedUser, permissions);
    Alert.alert("Success", "Permissions saved!");
  }

  return (
    <View className="flex-1 p-4 bg-dark">
      <Dropdown
        data={users.map((u) => ({ label: u.name, value: u.id }))}
        labelField="label"
        valueField="value"
        placeholder="Select User"
        value={selectedUser}
        onChange={(item: any) => setSelectedUser(item.value)}
        style={{ backgroundColor: "#1f1f1f", padding: 10, borderRadius: 8, marginBottom: 20 }}
        selectedTextStyle={{ color: "white" }}
        placeholderStyle={{ color: "gray" }}
      />

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
               <View className="flex-row gap-2 items-center text-center">  
                <Text className="text-white text-lg"> Edit</Text>
                <Text className="text-white text-lg"> View</Text>
                <Text className="text-white text-lg"> Create</Text>
                <Text className="text-white text-lg"> Delete</Text>
              </View>
            </View>

            {mod.subModules.map((sub) => {
              const perm = permissions[sub.id] || { canView: false, canEdit: false, canDelete: false };
              return (
                <View key={sub.id} className="flex-row justify-between items-center p-2 border-b border-gray-600 w-full">
                  <Text className="text-white text-lg">{sub.name}</Text>
                  <View className="flex-row gap-3 w-full items-center justify-between">
                    <Checkbox value={perm.canView} onValueChange={(v) => togglePermission(sub.id, "canView", v)} color={perm.canView ? "#fdb714" : undefined} />
                    <Checkbox value={perm.canCreate} onValueChange={(v) => togglePermission(sub.id, "canCreate", v)} color={perm.canCreate ? "#fdb714" : undefined} />

                    <Checkbox value={perm.canEdit} onValueChange={(v) => togglePermission(sub.id, "canEdit", v)} color={perm.canEdit ? "#fdb714" : undefined} />
                    
                    <Checkbox value={perm.canDelete} onValueChange={(v) => togglePermission(sub.id, "canDelete", v)} color={perm.canDelete ? "red" : undefined} />
                    
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
