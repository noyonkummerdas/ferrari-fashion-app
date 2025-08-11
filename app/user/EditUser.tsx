import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditUser = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User Screen</Text>
      {/* Add your edit form here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default EditUser;
