import { View, Text, useColorScheme, TouchableOpacity, ScrollView, Image, Button, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';

import * as ImagePicker from 'expo-image-picker';
import CustomDropdown from '@/components/CustomDropdown';
import { useAddProductMutation } from '@/store/api/productApi';
import profile from "../../assets/images/profile.jpg"
import { useAddCustomerMutation } from '@/store/api/customerApi';


const AddCustomer = () => {
    const {userInfo} = useGlobalContext()
    const aamarId = userInfo?.aamarId;
    const warehouse = userInfo?.warehouse;
    const [isPhoto, setIsPhoto] = useState(false)

    const [addNewCustomer] = useAddCustomerMutation()

    const [gender,setGender] = useState([
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]);
    const [status,setStatus] = useState([
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]);

  


    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
        // headerRight: () => (
        // <View className='me-4' >
        //     <TouchableOpacity onPress={()=>setIsPhoto(!isPhoto)} className='flex flex-row justify-center items-center gap-2'>
        //       <Ionicons name={isPhoto ? "image-sharp" : "image-outline"} size={24}  color="#f2652d" />
        //       <Text className='text-primary text-xl font-pmedium'>Photo</Text>
        //     </TouchableOpacity>
        // </View>
        // ),
        title: "Add Customer",
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
    name: '',
    email: '',
    membership:"gold",
    gender:"",
    address:[
      {
        type:"Home",
        holdingNo:"",
        street:"",
        city:"",
        town:"",
        division:"",
        state:"",
        zipCode:"",
        country:"Bangladesh"
      }
    ],
    type:"regular",
    point:0,
    phone:"",
    photo:"",
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


  
  const handleCreateCustomer = async () => {
    try {
      const response = await addNewCustomer(form).unwrap();
      console.log('Product added successfully:', response);
      router.back();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }

  return (
    <ScrollView className='flex-1 bg-white p-6'>
      
        <View>
        <TouchableOpacity onPress={pickImage} className="flex justify-center items-center mb-10">
            <Image source={profile} className="w-48 h-48 rounded-full" />
        </TouchableOpacity>
      </View>
       
      <TextInput
        placeholder="Customer Name"
        value={form.name}
        onChangeText={(value) =>  handleInputChange( "name", value )}
        className="border border-gray-300 rounded-full p-4 mb-3"
      />

      <TextInput
        placeholder="Pnone no"
        value={form.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        className="border border-gray-300 rounded-full p-4 mb-3"
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleInputChange('email', value)}
        className="border border-gray-300 rounded-full p-4 mb-3"
      />
      <View className='flex flex-row gap-2 justify-between items-center'>
        <View className='flex-1'>
          <CustomDropdown
          data={gender}
          value={form.gender}
          placeholder='Gender'
          search={false}
          mode="modal"
          setValue={(value) => handleInputChange('gender', value)}
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

      

      <TouchableOpacity  onPress={ handleCreateCustomer} className="h-16 justify-center items-center rounded-full bg-primary mt-8">
        <Text className="text-white text-center text-xl font-pmedium">Add Customer</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddCustomer


