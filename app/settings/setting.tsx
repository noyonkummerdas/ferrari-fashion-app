import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import CustomInput from "@/components/customInput";
import PhotoUpload from "@/components/PhotoUploader";
import SaveButton from "@/components/SaveButton";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  useUpdateSettingMutation
} from "@/store/api/settingApi";
import { router, useNavigation } from "expo-router";

const SettingScreen = () => {
  const { userInfo, setUserInfo } = useGlobalContext();
  const aamarId = userInfo?.aamarId;
  const warehouse = userInfo?.warehouse;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const settings = useSelector((state: any) => state.setting);
  const { width } = Dimensions.get("window");

  const [isSaved, setIsSaved] = useState(true);
  const [paymentOptions, setPaymentOptions] = useState([
    { order: "bKash", name: "bKash", type: "mfs", status: true },
    { order: "nagad", name: "Nagad", type: "mfs", status: true },
    { order: "rocket", name: "Rocket", type: "mfs", status: true },
    { order: "upay", name: "Upay", type: "mfs", status: true },
    { order: "visa", name: "Visa", type: "card", status: true },
    { order: "dbbl", name: "DBBL", type: "card", status: true },
    { order: "mtb", name: "MTB", type: "card", status: true },
    { order: "amex", name: "AMEX", type: "card", status: true },
    { order: "ebl", name: "EBL", type: "card", status: true },
    { order: "brac", name: "BRAC", type: "card", status: true },
    { order: "masterCard", name: "MasterCard", type: "card", status: true },
  ]);

  const [updateSetting] = useUpdateSettingMutation();

  useEffect(() => {
    if (userInfo?.storeSettings?.paymentMethods?.length > 0) {
      setPaymentOptions([...paymentOptions, userInfo?.paymentMethods]);
    }
  }, []);

  // const {data} = useSettingQuery({aamarId})

  // console.log("DATa", JSON.stringify(data?.paymentMethods,null,2))
  // console.log("userInfo", JSON.stringify(userInfo?.storeSettings?.paymentMethods,null,2))

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity
            className="flex flex-row gap-2 items-center"
            onPress={() => handleUpdateSetting()}
          >
            <Text
              className={`text-lg ${isSaved ? "#ffffff" : "#ffffff"}`}
            >
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View className="flex flex-row me-4">
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
      ),
      title: "Settings",
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "dark"].backgroundColor,
      },
       headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
            headerTitleStyle: { fontWeight: "bold", fontSize: 18, color: "#ffffff" },
            headerShadowVisible: false,
            headerTitleAlign: "left",
            headerShown: true,
    });
  }, [navigation, colorScheme, isSaved]);

  const handleUpdateSetting = async () => {
    try {
      const updatedData = {
        ...userInfo?.storeSettings,
        paymentMethods: paymentOptions || [],
      };

      const response = await updateSetting({
        aamarId: userInfo.aamarId,
        storeSettings: updatedData,
      }).unwrap();
      setIsSaved(true);

      console.log("✅ Successfully updated:", response);
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      storeSettings: {
        ...userInfo.storeSettings,
        [field]: value,
      },
    });
    setIsSaved(false);
  };

  const handleAddressChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      storeSettings: {
        ...userInfo.storeSettings,
        address: {
          ...userInfo.storeSettings.address,
          [field]: value,
        },
      },
    });
    setIsSaved(false);
  };

  const handlePaymentStatusToggle = (orderKey, newStatus) => {
    console.log(orderKey, newStatus);
    const updated = paymentOptions.map((method) =>
      method?.order === orderKey ? { ...method, status: newStatus } : method,
    );
    setPaymentOptions(updated);
    setIsSaved(false);
  };

  // console.log("User Info", JSON.stringify(userInfo, null, 2));
  const onUploadSuccess = async (res) => {
    // console.log("Update User", JSON.stringify(res, null, 2));
    setUserInfo({
      ...userInfo,
      storeSettings: {
        ...userInfo.storeSettings,
        storePhoto: res.url,
      },
    });
    // fetchUser();
    const update = await useUpdateSettingMutation({
      storePhoto: res.url,
      _id: userInfo?.storeSettings?._id,
    });
    console.log(update);
    console.log("Update User", JSON.stringify(update, null, 2));
  };

  return (
    <ScrollView className="p-4 pb-8 bg-black">
      {/* Store Logo */}
      <Section title="Store Logo" icon="home-outline">
        {/* <Image
          source={{ uri: settings?.storeLogo }}
          className="w-full h-36 rounded-lg bg-gray-50"
        /> */}
        {/* <TouchableOpacity
          onPress={() => Alert.alert("Upload Photo")}
          className="h-52 w-full flex justify-center border border-slate-200 items-center rounded-md p-4"
        >
          <View className="h-14 w-14 absolute bottom-[-16] end-2 rounded-full flex justify-center items-center  bg-slate-100 border border-primary/30">
            <Ionicons name="camera-outline" size={20} />
          </View>
          <Image
            source={logo}
            style={{
              width: "100%",
              height: width * 0.15,
              resizeMode: "cover",
            }}
          />
        </TouchableOpacity> */}
        {/* <PhotoUploader
          uploadSuccess={()=>console.log('Upload Success')}
          aspectRatio={8/2}
          folderName={aamarId}
        /> */}
        <PhotoUpload
          displayWidth={800}
          displayHeight={200}
          outputWidth={800}
          outputHeight={200}
          allowDimensionControl={true}
          cropMode="exactSize"
          onUploadSuccess={onUploadSuccess}
        />
      </Section>

      {/* Basic Info */}

      <Section title="Basic Info" icon="person-outline">
        <View className="rounded-xl overflow-hidden ">
          <CustomInput
          className=" border-rounded-lg"
            icon="storefront-outline"
            title="Store Name"
            value={userInfo?.storeSettings?.storeName}
            setValue={(v) => handleInputChange("storeName", v)}
          />
          <CustomInput
            icon="business-outline"
            title="Business Type"
            value={userInfo?.storeSettings?.businessType}
            setValue={(v) => handleInputChange("businessType", v)}
          />
          <CustomInput
            icon="clipboard-outline"
            title="License No"
            value={userInfo?.storeSettings?.licenseNumber}
            setValue={(v) => handleInputChange("licenseNumber", v)}
          />
          <CustomInput
            IconComponent={MaterialCommunityIcons}
            icon="currency-bdt"
            title="Currency"
            value={userInfo?.storeSettings?.currency}
            setValue={(v) => handleInputChange("currency", v)}
            isLast
            isDropdown={true}
            dwList={[
              { label: "Bangladeshi TK (৳)", value: "BDT" },
              { label: "USD ($)", value: "USD" },
            ]}
          />
        </View>
      </Section>

      {/* Contact Info */}
      <Section title="Contact Info" icon="mail-outline">
        <View className="rounded-xl overflow-hidden">
          <CustomInput
            icon="mail-outline"
            title="Email"
            value={userInfo?.storeSettings?.email}
            setValue={(v) => handleInputChange("email", v)}
          />
          <CustomInput
            icon="call-outline"
            title="Phone"
            placeholder="+88018 XXXXX XXX"
            value={userInfo?.storeSettings?.phone}
            setValue={(v) => handleInputChange("phone", v)}
          />
          <CustomInput
            icon="globe-outline"
            title="Website"
            placeholder="www.website.com"
            value={userInfo?.storeSettings?.websiteUrl}
            setValue={(v) => handleInputChange("websiteUrl", v)}
          />
        </View>
      </Section>
      {/* Address Info */}
      <Section title="Store Location" icon="location-outline">
        <View className="rounded-xl overflow-hidden">
          <CustomInput
            IconComponent={MaterialCommunityIcons}
            icon="store-marker-outline"
            title="Street"
            value={userInfo?.storeSettings?.address?.street}
            setValue={(v) => handleAddressChange("street", v)}
          />
          <View className="flex flex-row gap-2 justify-between">
            <CustomInput
              IconComponent={MaterialCommunityIcons}
              className="flex-1"
              icon="home-city-outline"
              title="City"
              placeholder="Uttara"
              value={userInfo?.storeSettings?.address?.city}
              setValue={(v) => handleAddressChange("city", v)}
            />
            <CustomInput
              IconComponent={FontAwesome6}
              className="flex-1"
              icon="mountain-city"
              title="State"
              placeholder="Dhaka"
              value={userInfo?.storeSettings?.address?.state}
              setValue={(v) => handleAddressChange("websiteUrl", v)}
            />
          </View>
          <View className="flex flex-row gap-2 justify-between">
            <CustomInput
              IconComponent={MaterialCommunityIcons}
              className="flex-1"
              icon="mailbox-up-outline"
              title="Post"
              placeholder="Uttara"
              value={userInfo?.storeSettings?.address?.post}
              setValue={(v) => handleAddressChange("post", v)}
            />
            <CustomInput
              className="flex-1"
              icon="code-outline"
              title="ZipCode"
              placeholder="Dhaka"
              value={userInfo?.storeSettings?.address?.zip}
              setValue={(v) => handleAddressChange("zip", v)}
            />
          </View>
          <CustomInput
            icon="location-outline"
            title="Country"
            value={userInfo?.storeSettings?.address?.country}
            setValue={(v) => handleAddressChange("country", v)}
            isLast
          />
        </View>
      </Section>

      {/* POS Settings */}
      <Section title="POS Settings" icon="reader-outline">
        <View className="rounded-xl overflow-hidden">
          <CustomInput
            IconComponent={MaterialCommunityIcons}
            icon="format-text-rotation-none"
            title="Invoice Prefix"
            value={userInfo?.storeSettings?.invoiceIdPrefix}
            setValue={(v) => handleInputChange("invoiceIdPrefix", v)}
          />
          <CustomInput
            IconComponent={AntDesign}
            icon="printer"
            title="Invoice Size"
            placeholder="80 mm"
            value={userInfo?.storeSettings?.invoiceSize}
            setValue={(v) => handleInputChange("invoiceSize", v)}
            isDropdown={true}
            dwList={[
              { label: "65mm - POS Printer", value: "65" },
              { label: "80mm - POS Printer", value: "80" },
              { label: "A4 - Full Invoice", value: "A4" },
            ]}
          />
          {/* <CustomInput
            IconComponent={MaterialCommunityIcons}
            icon="responsive"
            title="POS Screen"
            placeholder='Secured'
            value={userInfo?.storeSettings?.posScreen}
            setValue={(v) => handleInputChange("posScreen",v)}
            isDropdown={true}
            dwList={[
              {label: "Secure POS", value:"pos"},
              {label: "Unsecured", value:"pos2"},
              {label: "POS 3", value:"pos3"},
            ]}
          /> */}
          <CustomInput
            IconComponent={Fontisto}
            icon="shopping-pos-machine"
            title="Application Mode"
            value={userInfo?.storeSettings?.appMode}
            setValue={(v) => handleInputChange("appMode", v)}
            isDropdown={true}
            dwList={[
              { label: "🟢 Easy Mode", value: "easy" },
              { label: "🟠 Medium Mode", value: "medium" },
              { label: "🔴 Advanced Mode", value: "advanced" },
            ]}
            isLast
          />
        </View>
        {/* <InputField label="Invoice Prefix" value={settings?.invoicePrefix} onChangeText={(text) => handleInputChange('invoicePrefix', text)} />
        <InputField label="Invoice Size" value={settings?.invoiceSize} onChangeText={(text) => handleInputChange('invoiceSize', text)} />
        <InputField label="POS Screen" value={settings?.posScreen} onChangeText={(text) => handleInputChange('posScreen', text)} />
        <SaveButton onPress={() => {}} className="w-64 py-3" align="right" /> */}
      </Section>

      {/* VAT Settings */}
      {/* <Section title="VAT/Tax Amount" icon="pricetag-outline">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-700">Enable VAT</Text>
          <Switch value={settings?.vatEnabled} onValueChange={() => dispatch(toggleVAT())} />
        </View>
        <View className="rounded-xl overflow-hidden">
          <CustomInput
              IconComponent={MaterialCommunityIcons}
              icon="responsive"
              title="BIN No"
              placeholder='BDA235424'
              value=""
              setValue={(v) =>  {console.log(v)}}
            />
            <CustomInput
              IconComponent={Fontisto}
              icon="shopping-pos-machine"
              title="Avg Vat Amount"
              placeholder='7.5'
              value=""
              setValue={(v) => {console.log(v)}}
              isLast
            />
          </View>
      
      </Section> */}

      {/* Loyalty Points */}
      <Section title="Loyalty Point Settings" icon="gift-outline">
        <View className="flex-row justify-between items-center mb-3 pe-2">
          <Text className="text-gray-400 text-lg">Enable Loyalty Points</Text>
          {/* <Switch value={settings?.loyaltyEnabled} onValueChange={() => dispatch(toggleLoyalty())} /> */}
          <Switch
            value={userInfo?.storeSettings?.isRoyalty}
            onValueChange={(value) => {
              handleInputChange("isRoyalty", value);
            }}
            trackColor={{ false: "#ccc", true: "rgba(255, 106, 57, 0.18)" }}
            thumbColor={
              userInfo?.storeSettings?.isRoyalty
                ? "rgba(255, 106, 57, 0.8)"
                : "#f4f3f4"
            }
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          />
        </View>
        <View className="rounded-xl overflow-hidden">
          <View className="flex flex-row gap-2 justify-between">
            <CustomInput
              className="flex-1"
              icon="cash-outline"
              title="Amount"
              placeholder="Amount"
              value={userInfo?.storeSettings?.royaltyAmount?.toString()}
              setValue={(v) => handleInputChange("royaltyAmount", v)}
              isLast
            />
            <CustomInput
              IconComponent={FontAwesome5}
              className="flex-1"
              icon="receipt"
              title="Point"
              placeholder="Point"
              value={userInfo?.storeSettings?.royaltyPoint?.toString()}
              setValue={(v) => handleInputChange("royaltyPoint", v)}
              isLast
            />
          </View>
        </View>
        {/* <InputField label="Amount" value={settings?.loyaltyAmount?.toString()} onChangeText={(text) => handleInputChange('loyaltyAmount', parseFloat(text))} keyboardType="numeric" />
        <SaveButton onPress={() => {}} className="w-64 py-3" align="right" /> */}
      </Section>

      {/* Payment Methods */}
      <Section title="Payment Settings" icon="card-outline">
        <View className="ms-6">
          {["mfs", "card"].map((type) => {
            const filtered = paymentOptions.filter((opt) => opt?.type === type);

            const rows = filtered.reduce((acc, item, idx) => {
              if (idx % 2 === 0) acc.push([item]);
              else acc[acc.length - 1].push(item);
              return acc;
            }, []);

            return (
              <View key={type} className="mb-4">
                <Text className="text-lg font-semibold capitalize mb-2 text-gray-400">
                  {type}
                </Text>
                {rows.map((row, rowIndex) => (
                  <View
                    key={rowIndex}
                    className="flex-row justify-between mb-2"
                  >
                    {row.map((method, colIndex) => {
                      const actualIndex = paymentOptions.findIndex(
                        (m) => m?.order === method?.order,
                      );
                      return (
                        <View
                          key={method?.order}
                          className="flex-row items-center w-[48%] gap-2"
                        >
                          <Switch
                            value={method.status}
                            onValueChange={(value) => {
                              // const updatedMethods = [...settings.paymentMethods];
                              // updatedMethods[actualIndex].status = value;
                              // dispatch(setPaymentMethods(updatedMethods));
                              handlePaymentStatusToggle(method?.order, value);
                            }}
                            trackColor={{
                              false: "#ccc",
                              true: "#131313",
                            }}
                            thumbColor={
                              method?.status
                                ? "#f4f3f4"
                                : "#f4f3f4"
                            }
                            style={{
                              transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                            }}
                          />
                          <Text className="ml-2 text-lg text-gray-400">{method?.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        <SaveButton
          onPress={() => console.log("Pressed!")}
          title="Save Settings"
          className="w-64 py-3"
          align="right"
        />
      </Section>
    </ScrollView>
  );
};

// Small utility to DRY repeated section structure
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) => (
  <View className="border-b border-primary/40 pb-8 mb-4">
    <View className="flex-row items-center mb-4 gap-2 mt-6">
      <Ionicons name={icon} size={24} color="black" />
      <Text className="text-xl font-bold">{title}</Text>
    </View>
    {children}
  </View>
);

export default SettingScreen;
