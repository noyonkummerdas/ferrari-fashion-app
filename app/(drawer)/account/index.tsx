import { CustomDrawerToggleButton } from "@/components";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
// import { CustomDrawerToggleButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import React, { useLayoutEffect } from "react";
// import { useColorScheme } from "react-native";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";

// const CustomDrawerToggleButton = ({ tintColor = "#FDB714" }) => {
// 	const navigation = useNavigation();

// 	return (
// 		<TouchableOpacity
// 			onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
// 			style={{ marginLeft: 16 }}
// 		>
// 			<Ionicons name="menu" size={24} color={tintColor} />
// 		</TouchableOpacity>
// 	);
// };

const Accounts = () => {
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
        title: "Accounts",
        //@ts-ignore
        headerStyle: {
          backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
        },
         headerLeft: () => <CustomDrawerToggleButton tintColor="#ffffff" />,
        //@ts-ignore
        headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
        headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      });
    }, [navigation]);

	return (
		<ScrollView className="flex-1 bg-black-700 p-4" showsVerticalScrollIndicator={false}>
			{/* Row 1 */}
			<View className="flex-row mb-4">
				<TouchableOpacity
					className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center mr-2"
					activeOpacity={0.8}
					onPress={() => router.push("/account/cashDeposit/cashDipositDetails")}
				>
					<Ionicons name="wallet" size={28} color="#FDB714" />
					<Text className="text-white text-base mt-2">Cash Deposit</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center ml-2"
					activeOpacity={0.8}
					onPress={() =>router.push("/account/cashOut/cashOutdetails")}
				>
					<Ionicons name="card" size={28} color="#FDB714" />
					<Text className="text-white text-base mt-2">Cash Out</Text>
				</TouchableOpacity>
			</View>
            		{/* Row 2 */}
			<View className="flex-row mt-4">
				<TouchableOpacity
					className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center mr-2"
					activeOpacity={0.8}
					onPress={() =>router.push ('/account/payment/payment')}
				>
					<Ionicons name="cash" size={28} color="#FDB714" />
					<Text className="text-white text-base mt-2">Payment</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="flex-1 bg-black-200 rounded-xl h-28 justify-center items-center ml-2"
					activeOpacity={0.8}
					onPress={() =>router.push ('/account/recived-payment/recived-payment')}
				>
					<Ionicons name="checkmark-done-circle" size={28} color="#FDB714" />
					<Text className="text-white text-base mt-2">Received Payment</Text>
				</TouchableOpacity>
			</View>


			{/* Transactions Summary Cards */}
			<View className="mt-4">
                

				<Text className="text-white text-lg font-pbold mb-4 mt-2">Transactions</Text>

                {/* Top balances */}
				<View className="flex-row mb-4">
					<View className="flex-1 mr-2 bg-black-200 rounded-xl h-28 p-4 mr-2 border border-gray-700">
						<View className="flex-row items-center justify-between mb-1">
							<Text className="text-gray-300">Opening Balance</Text>
							<Ionicons name="trending-up" size={18} color="#86EFAC" />
						</View>
						<Text className="text-white text-xl font-pbold">0.00</Text>
					</View>
					<View className="flex-1 ml-2 bg-black-200 rounded-xl h-28 p-4 mr-2 border border-gray-700">
						<View className="flex-row items-center justify-between mb-1">
							<Text className="text-gray-300">Current Balance</Text>
							<Ionicons name="wallet" size={18} color="#FDB714" />
						</View>
						<Text className="text-white text-xl font-pbold">0.00</Text>
					</View>
				</View>

				<View className="flex-row mb-4">
					<View className="flex-1 bg-black-200 rounded-xl p-4 h-28 mr-2 border border-gray-700">
						<View className="flex-row items-center mb-2">
							<View className="w-9 h-9 rounded-full bg-black-700 items-center justify-center">
								<Ionicons name="cash" size={18} color="#60A5FA" />
							</View>
							<Text className="text-gray-300 ml-2">Payment</Text>
						</View>
						<Text className="text-white text-xl font-pbold">0.00</Text>
					</View>
					<View className="flex-1 bg-black-200 rounded-xl p-4 h-28 ml-2 border border-gray-700">
						<View className="flex-row items-center mb-2">
							<View className="w-9 h-9 rounded-full bg-black-700 items-center justify-center">
								<Ionicons name="checkmark-done-circle" size={18} color="#86EFAC" />
							</View>
							<Text className="text-gray-300 ml-2">Payment Received</Text>
						</View>
						<Text className="text-white text-xl font-pbold">0.00</Text>
					</View>
				</View>
				<View className="flex-row mb-4">
					<View className="flex-1 bg-black-200 rounded-xl p-4 mr-2 h-28 border border-gray-700">
						<View className="flex-row items-center mb-2">
							<View className="w-9 h-9 rounded-full bg-black-700 items-center justify-center">
								<Ionicons name="arrow-up-circle" size={18} color="#F87171" />
							</View>
							<Text className="text-gray-300 ml-2">Cash Out</Text>
						</View>
						<Text className="text-white text-xl font-pbold">0.00</Text>
					</View>
					<View className="flex-1 bg-black-200 rounded-xl p-4 ml-2 h-28 border border-gray-700">
						<View className="flex-row items-center mb-2">
							<View className="w-9 h-9 rounded-full bg-black-700 items-center justify-center">
								<Ionicons name="arrow-down-circle" size={18} color="#34D399" />
							</View>
							<Text className="text-gray-300 ml-2">Cash In</Text>
						</View>
						<Text className="text-white text-xl font-pbold">0.00</Text>
					</View>
				</View>
			</View>

	
			{/* Account Overview Details */}


			{/* <View className="bg-black-200 rounded-2xl p-4 mt-4 mb-2 border border-gray-700"> */}
				{/* <View className="flex-row items-center mb-4">
					<View className="w-10 h-10 rounded-full bg-black-700 items-center justify-center mr-3">
						<Ionicons name="reader" size={22} color="#FDB714" />
					</View>
					<View className="flex-1">
						<Text className="text-white text-lg font-pbold">Account Overview</Text>
						<Text className="text-gray-400 text-xs">Summary of balances and movements</Text>
					</View>
				</View> */}

				

				{/* Movements */}
				{/* <View className="border-t border-gray-700 pt-3">
					<View className="flex-row items-center justify-between py-2">
						<View className="flex-row items-center">
							<Ionicons name="cash" size={18} color="#60A5FA" />
							<Text className="text-gray-300 ml-2">Payment</Text>
						</View>
						<Text className="text-primary font-psemibold">0.00</Text>
					</View>
					<View className="flex-row items-center justify-between py-2">
						<View className="flex-row items-center">
							<Ionicons name="checkmark-done-circle" size={18} color="#86EFAC" />
							<Text className="text-gray-300 ml-2">Payment Received</Text>
						</View>
						<Text className="text-primary font-psemibold">0.00</Text>
					</View>
					<View className="flex-row items-center justify-between py-2">
						<View className="flex-row items-center">
							<Ionicons name="arrow-up-circle" size={18} color="#F87171" />
							<Text className="text-gray-300 ml-2">Cash Out</Text>
						</View>
						<Text className="text-primary font-psemibold">0.00</Text>
					</View>
					<View className="flex-row items-center justify-between py-2">
						<View className="flex-row items-center">
							<Ionicons name="arrow-down-circle" size={18} color="#34D399" />
							<Text className="text-gray-300 ml-2">Cash In</Text>
						</View>
						<Text className="text-primary font-psemibold">0.00</Text>
					</View>
				</View> */}
			{/* </View> */}



		</ScrollView>
	);
};

export default Accounts;
