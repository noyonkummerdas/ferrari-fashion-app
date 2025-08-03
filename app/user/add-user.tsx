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
import { useAddUserMutation } from '@/store/api/userApi';


const AddUser = () => {
    const {userInfo} = useGlobalContext()
    const aamarId = userInfo?.aamarId;
    const warehouse = userInfo?.warehouse;
    const [isPhoto, setIsPhoto] = useState(false)

    const [addNewUser] = useAddUserMutation()

    const [type,setType] = useState([
                { label: 'Admin', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'POS', value: 'POS' },
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
        title: "Add User",
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
      name: "",
      email: "",
      username: "",
      password: "",
      type: "manager",
      // photo: "",
      phone: "",
      status:"active",
      aamarId: aamarId,
      warehouse: warehouse,
  });




  console.log("CUSTOMER DATA",form)

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  useEffect(() => {
    handleInputChange('username', form?.phone)
  },[form?.phone])


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


  
  const handleCreateUser = async () => {
    try {
      const response = await addNewUser(form).unwrap();
      console.log('User added successfully:', response);
      router.back();
    } catch (error) {
      console.error('Error adding User:', error);
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
        placeholder="User Name"
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
        placeholder="Password"
        value={form.password}
        secureTextEntry={true}
        onChangeText={(value) => handleInputChange('password', value)}
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
          data={type}
          value={form.type}
          placeholder='Type'
          mode="modal"
          setValue={(value) => handleInputChange('type', value)}
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

      

      <TouchableOpacity  onPress={ handleCreateUser} className="h-16 justify-center items-center rounded-full bg-primary mt-8">
        <Text className="text-white text-center text-xl font-pmedium">Add User</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddUser


