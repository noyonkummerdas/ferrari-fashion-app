import React, {  useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

interface CustomMultiSelectProps {
  items: { id: string; name: string }[];
  selectedItem: string | null;
  onSelect: (item: string | null) => void;
  placeholder?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  items,
  selectedItem,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedItem ? [selectedItem] : []);
  const handleSelectionChange = (selected: string[]) => {
    const selectedValue = selected.length > 0 ? selected[0] : null;
    setSelectedItems(selected);
    onSelect(selectedValue);
    
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        hideTags
        single={true}
        items={items}
        uniqueKey="_id"
        onSelectedItemsChange={handleSelectionChange}
        selectedItems={selectedItems}
        // single={true}
        selectText={placeholder}
        searchInputPlaceholderText="Search..."
        tagRemoveIconColor="#ff3d00"
        tagBorderColor="#ff3d00"
        tagTextColor="#ff3d00"
        selectedItemTextColor="#ff3d00"
        selectedItemIconColor="#ff3d00"
        itemTextColor="#000"
        // displayKey="name"
        searchInputStyle={{ color: '#000' }}
        submitButtonColor="#ff3d00"
        // submitButtonText="Confirm"
        flatListProps={{
          renderItem: ({ item }: { item: { _id: string; name: string,stock:string } }) => (
            <TouchableOpacity style={styles.customItem} onPress={() => handleSelectionChange([item._id])}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.stock}</Text>
            </TouchableOpacity>
          ),
          keyExtractor: (item) => item?._id,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  customItem: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CustomMultiSelect;
