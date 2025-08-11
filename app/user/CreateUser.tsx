import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateUser = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create User Screen</Text>
      {/* Add your create form here */}
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

export default CreateUser;
