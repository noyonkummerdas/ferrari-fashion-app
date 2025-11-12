import photo from "@/assets/images/profile.jpg";
import { BASE_URL } from "@/constants/baseUrl";
import { useGetProxyUrl } from "@/hooks/useGetProxyUrl";
import { useProxyPhotoUrlQuery } from "@/store/api/uploadApi";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

type PhotoUploaderProps = {
  existingPhoto?: string | null;
  placeholder?: any;
  onUploadSuccess?: (url: string) => void;
  folderName?: string;
  maxFileSize?: number;
  imageQuality?: number;
  aspectRatio?: [number, number];
  previewStyle?: 'square' | 'round' | 'round-full';
}


const PhotoUploader = ({ 
  previewStyle, 
  existingPhoto, 
  placeholder = photo, 
  onUploadSuccess, 
  folderName = 'ffapp', 
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  imageQuality = 0.8, 
  aspectRatio = [4, 4] 
}: PhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(existingPhoto || null);
  const PROXY_URL = `${BASE_URL}/fileManager/photo-url/${encodeURIComponent('')}`;

  // console.log("CURRENT PHOTO", existingPhoto);

  useEffect(() => {
    setCurrentPhoto(existingPhoto || null);
  }, [existingPhoto]);

  const handleImageSelection = async (uri: string) => {
    setIsUploading(true);
    try {
      // Create FormData for upload
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // @ts-ignore - FormData append with file object works in React Native
      formData.append('photo', {
        uri,
        name: `upload-${Date.now()}.jpg`,
        type,
      });
      
      formData.append('bucketName', folderName);

      const uploadUrl = `${BASE_URL}/fileManager/upload`;
      // console.log('Uploading to:', uploadUrl);
      // console.log('Folder name:', folderName);

      // Upload to API server which handles MinIO upload
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server error response:', text);
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      console.log("DATA", data);
      
      if (data.upURL) {
        // const proxyUrl = `${PROXY_URL}${encodeURIComponent(data.upURL)}`;
        // console.log('Proxy URL:', proxyUrl);
        // setCurrentPhoto(proxyUrl);
        console.log("DATA.upURL", data.upURL);
        console.log("DATA.url", data.url);
        onUploadSuccess(data.upURL);
        // const photo = await useGetProxyUrl(data.url);
        console.log("CURRENT URL", data.upURL);
        setCurrentPhoto(data.upURL);
      //   Alert.alert('Success', 'Photo uploaded successfully!');
      } 
      else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: aspectRatio,
        quality: imageQuality,
      });

      // console.log('Result:', result);

      if (!result.canceled && result.assets[0]) {
        await handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: aspectRatio,
        quality: imageQuality,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={showImagePickerOptions}
        className="flex justify-center items-center relative"
        disabled={isUploading}
      >
        <Image 
          source={currentPhoto ? { uri: currentPhoto } : placeholder} 
          className={`w-40 h-40 ${previewStyle === 'round' ? 'rounded-lg' : previewStyle === 'round-full' ? 'rounded-full' : ''}`} 
          resizeMode="cover"
        />
        {isUploading && (
          <View className="absolute inset-0 bg-black/50 rounded-lg justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white text-xs mt-2">Uploading...</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {!isUploading && (
        <Text className="text-gray-500 text-xs mt-2">Tap to change photo</Text>
      )}
    </View>
  )
}

export default PhotoUploader