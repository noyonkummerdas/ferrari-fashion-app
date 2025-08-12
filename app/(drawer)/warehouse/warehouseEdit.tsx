import Profile from '@/app/settings/profile';
import { Colors } from '@/constants/Colors';
import { useAddWarehouseMutation } from '@/store/api/warehouseApi'; // ✅ change to your actual import
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const WarehouseEdit = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  // ✅ RTK Query mutation hook
  const [addWarehouse] = useAddWarehouseMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Warehouse Edit',
      headerStyle: { backgroundColor: Colors[colorScheme ?? 'dark'].backgroundColor },
      headerTintColor: Colors[colorScheme ?? 'dark'].backgroundColor,
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18, color: '#ffffff' },
      headerShadowVisible: false,
      headerTitleAlign: 'left',
      headerShown: true,
    });
  }, [navigation]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    membership: 'gold',
    gender: '',
    address: [
      {
        type: 'Home',
        holdingNo: '',
        street: '',
        city: '',
        town: '',
        division: '',
        state: '',
        zipCode: '',
        country: 'Bangladesh',
      },
    ],
    type: 'regular',
    point: 0,
    phone: '',
    openingBalance: '',
    photo: '',
    status: 'active',
  });

  // ✅ Image Picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, photo: result.assets[0].uri });
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await addWarehouse(form).unwrap();
      console.log('Warehouse added:', response);
      router.back();
    } catch (error) {
      console.error('Error adding warehouse:', error);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-dark p-6">
        {/* Profile Image */}
        <TouchableOpacity onPress={pickImage} className="flex justify-center items-center mb-10">
          <Image
            source={form.photo ? { uri: form.photo } : Profile}
            className="w-48 h-48 rounded-full"
          />
        </TouchableOpacity>

        {/* Name */}
        <TextInput
          placeholder="Customer Name"
          value={form.name}
          onChangeText={(value) => handleInputChange('name', value)}
          className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
        />

        {/* Phone */}
        <TextInput
          placeholder="Phone number"
          value={form.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
        />

        {/* Address */}
        <TextInput
          placeholder="Address"
          value={form.address[0].street}
          onChangeText={(value) => handleInputChange('address[0].street', value)}
          className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
        />

        {/* Opening Balance */}
        <TextInput
          placeholder="Opening balance"
          value={form.openingBalance}
          onChangeText={(value) => handleInputChange('openingBalance', value)}
          keyboardType="numeric"
          className="border bg-black-200 rounded-full p-4 mb-3 mt-2 placeholder:text-gray-500 text-gray-200"
        /> 
        {/* Opening Balance */}


        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleCreateCustomer}
          className="h-16 justify-center items-center rounded-full bg-primary mt-8"
        >
          <Text className="text-white text-center text-2xl font-pmedium">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WarehouseEdit;
