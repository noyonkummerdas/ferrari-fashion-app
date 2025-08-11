import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const profilePic = require('../../assets/images/profile.jpg');

const menuItems = [
  {
    title: 'Account',
    items: [
    //   { icon: <Ionicons name="notifications-outline" size={22} color="#fdb714" />, label: 'Notification' },
      { icon: <MaterialIcons name="email" size={24} color="#fdb714" />, label: 'Email Preference' },
      { icon: <FontAwesome name="credit-card" size={24} color="#fdb714" />, label: 'Payment' },
      { icon: <MaterialIcons name="history" size={24} color="#fdb714" />, label: 'History' },
    ],
  },
  {
    title: 'Action',
    items: [
      { icon: <Entypo name="key" size={24} color="#fdb714" />, label: 'Change Password' },
      { icon: <MaterialIcons name="check-circle-outline" size={24} color="#fdb714" />, label: 'Active Log' },
      { icon: <MaterialIcons name="business" size={24} color="#fdb714" />, label: 'Switch Warehouse' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: <MaterialIcons name="logout" size={24} color="#fdb714" />, label: 'Log Out' },
      { icon: <MaterialIcons name="help-outline" size={24} color="#fdb714" />, label: 'Help' },
    ],
  },
];

const UserProfile = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-black-200 pt-10 px-4">
      <StatusBar style="light" backgroundColor="#1f2937" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        {/* <View className="flex-row items-center mb-5">
          <TouchableOpacity className="mr-2" onPress={() => navigation.goBack()}>
            <Text className="text-white text-xl">{'<'} </Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Profile</Text>
        </View> */}

        {/* Profile Card */}
        <View className="flex-row items-center bg-zinc-800 rounded-xl p-4 mb-6">
          <Image source={profilePic} className="w-14 h-14 rounded-full mr-3 border-2 border-yellow-500" />
          <View className="flex-1">
            <Text className="text-white text-xl font-bold ">
              NK Noyon <Text className="text-yellow-500 text-lg">(Admin)</Text>
            </Text>
            <Text className="text-zinc-300 text-sm mt-0.5">nknoyon01936@gmail.com</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="p-1.5 mr-1" onPress={() => navigation.navigate('EditUser')}>
              <Text className="text-lg text-zinc-300"><Ionicons name="eyedrop-sharp" size={24} color="#fdb714" /></Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-1.5" onPress={() => navigation.navigate('CreateUser')}>
              <Text className="text-lg text-yellow-500">➕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <View key={section.title} className="mb-7">
            <Text className="text-white text-xl font-regular mb-2">{section.title}</Text>
            <View className="bg-zinc-800 rounded-xl py-2 px-1">
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  className="flex-row items-center py-3 px-2"
                >
                  <View className="mr-3">{item.icon}</View>
                  <Text className="flex-1 text-white text-sm">{item.label}</Text>
                  <Text className="text-yellow-500 text-[24px] ml-2">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
};

export default UserProfile;
