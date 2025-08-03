import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router, useNavigation } from "expo-router";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import profile from "../../assets/images/profile.jpg";
import CustomInput from "@/components/customInput";
import { useUpdateUserMutation } from "@/store/api/userApi";
import PhotoUpload from "@/components/PhotoUploader";

export function ProfileItem({ icon, label, value }) {
  return (
    <View className="flex-row items-center gap-4">
      <Ionicons name={icon} size={30} color="#f2652d" />
      <View className="gap-1">
        <Text className="text-gray-500 text-lg">{label}</Text>
        <Text className="text-xl font-semibold">{value}</Text>
      </View>
    </View>
  );
}

const Profile = () => {
  const { userInfo, setUserInfo, fetchUser } = useGlobalContext();
  const [useUpdateUser] = useUpdateUserMutation();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({
    name: "",
    phone: "",
    password: "",
    email: "",
    // status: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile",
      //@ts-ignore
      headerStyle: {
        backgroundColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      },
      //@ts-ignore
      headerTintColor: `${Colors[colorScheme ?? "dark"].backgroundColor}`,
      headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerShown: true,
      headerRight: () =>
        !isEdit ? (
          <TouchableOpacity
            className="flex-row justify-center items-center gap-2"
            onPress={() => setIsEdit(true)}
          >
            <Ionicons name="pencil" size={20} />
            <Text className="text-lg text-primary">Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-row justify-center items-center gap-2"
            onPress={() => setIsEdit(false)}
          >
            <Ionicons name="close" size={20} />
            <Text className="text-lg text-primary">Cancle</Text>
          </TouchableOpacity>
        ),
    });
  }, [navigation, isEdit]);

  const handleInputPasswordChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
    // setIsSaved(false)
    console.log(field, value);
  };
  const handleInputChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      [field]: value,
    });
    // setIsSaved(false)
    console.log(field, value);
  };

  const updateUser = async () => {
    const data = {
      _id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
    };

    if (user.password !== "") {
      data.password = user.password;
    }

    console.log(data);
    const update = await useUpdateUser(data);
    // console.log(userInfo);
    console.log("Update User", JSON.stringify(update, null, 2));
  };

  // console.log("User Info", JSON.stringify(user, null, 2));
  const onUploadSuccess = async (res) => {
    // console.log(res);
    setUserInfo({
      ...userInfo,
      photo: res.url,
    });
    fetchUser();
    const update = await useUpdateUser(data);
    // console.log(userInfo);
    console.log("Update User", JSON.stringify(update, null, 2));
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Top Section */}
      <View className="items-center p-6 rounded-b-3xl">
        {/* <Image source={profile} className="w-36 h-36 rounded-full mb-4" /> */}
        <PhotoUpload
          displayWidth={200}
          displayHeight={200}
          outputWidth={200}
          outputHeight={200}
          allowDimensionControl={true}
          cropMode="exactSize"
          isAvatar={true}
          onUploadSuccess={onUploadSuccess}
        />
        <Text className="text-2xl font-bold ">{userInfo?.name}</Text>
        <Text className=" mt-1">@{userInfo?.username}</Text>
      </View>

      {/* Profile Details */}
      <View className="p-6 space-y-6 gap-y-8">
        {!isEdit ? (
          <View className="gap-y-8">
            <ProfileItem
              icon="person-outline"
              label="Name"
              value={userInfo?.name}
            />
            <ProfileItem
              icon="at"
              label="Username"
              value={userInfo?.username}
            />
            <ProfileItem
              icon="mail-outline"
              label="Email"
              value={userInfo?.email}
            />
            <ProfileItem
              icon="phone-portrait-outline"
              label="Phone"
              value={userInfo?.phone}
            />
            <ProfileItem
              icon="eye-outline"
              label="Status"
              value={userInfo?.status}
            />
          </View>
        ) : (
          <View className="rounded-xl overflow-hidden">
            <CustomInput
              icon="person-outline"
              title="Name"
              value={userInfo?.name}
              setValue={(v) => handleInputChange("name", v)}
            />
            <CustomInput
              icon="phone-portrait-outline"
              title="Phone"
              value={userInfo?.phone}
              setValue={(v) => handleInputChange("phone", v)}
            />
            <CustomInput
              icon="mail-outline"
              title="Email"
              value={userInfo?.email}
              setValue={(v) => handleInputChange("email", v)}
            />
            <CustomInput
              icon="key-outline"
              title="Password"
              value={user?.password || ""}
              setValue={(v) => handleInputPasswordChange("password", v)}
              inputType={"password"}
              placeholder="********"
              isLast
            />
          </View>
        )}
      </View>

      {/* Buttons */}
      <View className="p-6 space-y-4">
        {isEdit ? (
          <TouchableOpacity
            onPress={updateUser}
            className="bg-orange-500 p-4 mx-24 my-4 rounded-2xl items-center"
          >
            <Text className="text-white text-lg font-semibold">Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="border border-orange-500 mx-24 my-4  p-4 rounded-2xl items-center">
            <Text className="text-orange-500 text-lg font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
