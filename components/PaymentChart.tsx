import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface PaymentChartProps {
  data?: {
    payments: number[];
    collections: number[];
    labels: string[];
  };
}

export const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  // console.log(data);
  // Default data for last 7 days
  const defaultData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: data?.payments || [
          20000, 45000, 28000, 80000, 99000, 43000, 50000,
        ],
        color: (opacity = 1) => `rgba(253, 183, 20, ${opacity})`, // Primary color
        strokeWidth: 3,
      },
      {
        data: data?.collections || [
          15000, 35000, 25000, 70000, 85000, 38000, 45000,
        ],
        color: (opacity = 1) => `rgba(255, 106, 57, ${opacity})`, // Accent color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#242424",
    backgroundGradientFrom: "#242424",
    backgroundGradientTo: "#242424",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
    },
    formatYLabel: (value: string) => {
      const num = parseInt(value);
      if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}k`;
      }
      return value;
    },
  };

  return (
    <View className="bg-black-200 p-4 rounded-lg">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-lg font-pbold">Last 7 Days</Text>
        <View className="flex-row">
          <View className="flex-row items-center mr-4">
            <View className="w-3 h-3 rounded-full bg-primary mr-2" />
            <Text className="text-gray-400 text-xs">Payments</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-accent mr-2" />
            <Text className="text-gray-400 text-xs">Collections</Text>
          </View>
        </View>
      </View>

      <LineChart
        data={defaultData}
        width={screenWidth - 64} // Account for padding
        height={200}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 12,
        }}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />

      {/* <View className="flex-row justify-between mt-4">
        <View className="flex-1 items-center">
          <Text className="text-gray-400 text-xs mb-1">Total Payments</Text>
          <Text className="text-primary text-lg font-pbold">৳365k</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-gray-400 text-xs mb-1">Total Collections</Text>
          <Text className="text-accent text-lg font-pbold">৳313k</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-gray-400 text-xs mb-1">Difference</Text>
          <Text className="text-white text-lg font-pbold">৳52k</Text>
        </View>
      </View> */}
    </View>
  );
};
