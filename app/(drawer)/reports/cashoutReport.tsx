import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Dropdown } from "react-native-element-dropdown";
import { useWarehousesQuery } from "@/store/api/warehouseApi"; // import api warehouse
import { WarehouseTypes } from "@/types/warehouse"; //import warehousetypes

const cashOut = [
  { id: "co1", date: "2025-09-01", purpose: "Supplier Payment", amount: 7000 },
  { id: "co2", date: "2025-09-02", purpose: "Office Expense", amount: 2000 },
];

export default function CashOutReport() {
    
  const [cashOutReport, setCashOutReport] = useState<any>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());


  const currentUser = {
  role: "admin", // "admin" or "user"
  warehouse: "w1",
};
  //warehouse api
    const { data: userInfo } = { data: currentUser };
    const { data: warehousesData } = useWarehousesQuery();
    const [warehouses, setWarehouses] = useState<WarehouseTypes[]>([]);

    // warehouse  role
      const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
        currentUser.role === "user" ? currentUser.warehouse : null
      );
      // Set warehouses after fetch
      useEffect(() => {
        if (warehousesData) {
          setWarehouses(warehousesData);
          if (currentUser.role === "admin" && warehousesData.length > 0) {
            setSelectedWarehouse(warehousesData[0]._id);
          }
        }
      }, [warehousesData]);

      // filter data by  role, warehouse, date
      // const filteredData = cashInData
      //   ? cashInData.filter((item) => {
      //       const itemDate = new Date(item.date);
      //       const matchesDate =
      //         (isAfter(itemDate, fromDate) || itemDate.toDateString() === fromDate.toDateString()) &&
      //         (isBefore(itemDate, toDate) || itemDate.toDateString() === toDate.toDateString());
      
      //       const matchesWarehouse =
      //         currentUser.role === "admin"
      //           ? selectedWarehouse
      //             ? item.warehouse === selectedWarehouse
      //             : true
      //           : item.warehouse === currentUser.warehouse;
      
      //       return matchesDate && matchesWarehouse;
      //     })
      //   : [];
      

  return (
    <>

    {/**Admin */}
        <View className='flex-row items-center justify-between -2 mb-4'>
                  <View>
        
                    {/* <Text className="text-white ms-2 ">Select Warehouse</Text> */}
                  <Dropdown
                     data={warehouses.map((wh) => ({ label: wh.name, value: wh._id }))}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Warehouse"
                      value={selectedWarehouse}
                      onChange={(item: any) => setSelectedWarehouse(item.value)}
                      placeholderStyle={{ color: 'white' }}
                      style={{ backgroundColor: '#1f1f1f', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, width: 190, height: 45,marginTop: 10 }}
                      selectedTextStyle={{ color: 'white' }}
                      itemTextStyle={{ color: 'black' }}
                    />
                  </View>
        
                <View className="flex-row gap-3 mt-3">
                <TouchableOpacity onPress={() => setShowStartPicker(true)} className="p-2 ms-2 rounded-xl bg-black-200 flex-col">
                  <Text className='text-white'><Ionicons name="calendar-number-sharp" size={24} color="#fdb714" /></Text>
                  <Text className="text-white  text-sm"> {format(fromDate, "dd MMM yyyy")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} className="p-2 rounded-xl bg-black-200  flex-col">
                  <Text className='flex-row justify-end items-end text-end' ><Ionicons className="flex-row justify-end items-center " name="calendar-number-sharp" size={24} color="#fdb714" /></Text>
                  <Text className="text-white  text-sm"> {format(toDate, "dd MMM yyyy")}</Text>
                </TouchableOpacity>
              </View>
              </View>

                    <View className="flex-row justify-between mb-4">
                      <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
                        <Text className="text-zinc-300 text-sm">Total CashIn</Text>
                        <Text className="text-yellow-400 text-xl font-bold">25</Text>
                      </View>
                      <View className="bg-black-200 p-4 rounded-2xl w-[48%]">
                        <Text className="text-zinc-300 text-sm">Total amount</Text>
                        <Text className="text-primary text-xl font-bold">3,25,000 BDT</Text>
                      </View>
                    </View>
    {/** Cash Out Report */}
    <View className="flex-1 bg-dark p-2">
      <Text className="text-white text-xl font-bold mb-4">Cash Out Report</Text>

      <FlatList
        data={cashOut}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-black-200 p-4 rounded-xl mb-3">
            <Text className="text-white font-semibold">{item.purpose}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-400">{item.date}</Text>
              <Text className="text-red-400">- {item.amount} BDT</Text>
            </View>
          </View>
        )}
      />
    </View>
    </>
  );
}
