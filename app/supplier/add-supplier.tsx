import { Colors } from '@/constants/Colors';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

import CustomDropdown from '@/components/CustomDropdown';
import { useAddSupplierMutation } from '@/store/api/supplierApi';
import * as ImagePicker from 'expo-image-picker';
import profile from "../../assets/images/profile.jpg";


const AddSupplier = () => {
    const {userInfo} = useGlobalContext()
    const aamarId = userInfo?.aamarId;
    const warehouse = userInfo?.warehouse;
    const [isPhoto, setIsPhoto] = useState(false)

    const [addNewSupplier] = useAddSupplierMutation()

   
    const [status,setStatus] = useState([
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]);

  


    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
       
        title: "Add Supplier",
        //@ts-ignore
        headerStyle: { backgroundColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}` },
        //@ts-ignore
        headerTintColor: `${Colors[colorScheme ?? 'dark'].backgroundColor}`,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerShown: true,
        
    });
    }, [navigation,isPhoto]);

  const [form, setForm] = useState({
    name:"",
    email:"",
    code:"",
    company:"",
    // products"",
    address:"",
    phone:"",
    status:"active",
    aamarId: aamarId,
    warehouse: warehouse,
  });




  console.log("CUSTOMER DATA",form)

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, photo: result.assets[0].uri });
    }
  };


  
  const handleCreateSupplier = async () => {
    try {
      const response = await addNewSupplier(form).unwrap();
      console.log('Supplier added successfully:', response);
      router.back();
    } catch (error) {
      console.error('Error adding Supplier:', error);
    }
  }

  return (
    <ScrollView className='flex-1 bg-dark-200 p-6'>
      
        <View>
        <TouchableOpacity onPress={pickImage} className="flex justify-center items-center mb-310">
            <Image source={profile} className="w-48 h-48 rounded-full" />
        </TouchableOpacity>
      </View>
       
      <TextInput
        placeholder="Supplier Name"
        value={form.name}
        onChangeText={(value) =>  handleInputChange( "name", value )}
        className="border bg-dark-300 border-gray-300 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-200"
      />

      <TextInput
        placeholder="Phone no"
        value={form.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        className="border border-gray-300 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-800"
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleInputChange('email', value)}
        className="border border-gray-300 rounded-full p-4 mb-1  mt-2 placeholder:text-gray-500 text-gray-800"
      />
      <TextInput
        placeholder="Company"
        value={form.company}
        onChangeText={(value) => handleInputChange('company', value)}
        className="border border-gray-300 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-800"
      />
      <TextInput
        placeholder="Address"
        value={form.address}
        onChangeText={(value) => handleInputChange('address', value)}
        className="border border-gray-300 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-800"
      />
      <View className='flex flex-row gap-2 justify-between items-center'>
        <View className='flex-1'>
          <TextInput
            placeholder="Code"
            value={form.code}
            onChangeText={(value) => handleInputChange('code', value)}
            className="border border-gray-300 rounded-full p-4 mb-3  mt-2 placeholder:text-gray-500 text-gray-800"
          />
        </View>
        <View className='flex-1'>
          <CustomDropdown
          data={status}
          value={form.status}
          placeholder='Status'
          mode='modal'
          search={false}
          setValue={(value) => handleInputChange('status', value)}
          />
        </View>
      </View>

      

      <TouchableOpacity  onPress={ handleCreateSupplier} className="h-16 justify-center items-center rounded-full bg-primary mt-8">
        <Text className="text-white text-center text-xl font-pmedium">Add Supplier</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddSupplier


