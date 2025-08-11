import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
const UserProfile = () => {
    
    return(
        <View>
            <StatusBar style="light" backgroundColor="#1f2937" />
            <Text className='text-white'>this is the user infot</Text>
        </View>
    )
}

export default UserProfile;