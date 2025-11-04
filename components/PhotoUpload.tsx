import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ExpoPhotoUploader = ({
  existingPhoto = null,
  placeholder = null,
  onUploadSuccess = null,
  folderName = 'uploads',
  maxFileSize = 5 * 1024 * 1024, // 5MB
  imageQuality = 0.8,
  aspectRatio = [4, 3],
  baseUrl = "https://minio.aamardokan.online/",
  allowRotation = true,
  allowCrop = true,
}) => {
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  

  const PROXY_URL = `${baseUrl}fileManager/photo-url/`;

  // Load existing or placeholder photo
  useEffect(() => {
    if (existingPhoto) {
      setImageUri(`${PROXY_URL}${encodeURIComponent(existingPhoto)}`);
    } else if (placeholder) {
      setImageUri(placeholder);
    }
  }, [existingPhoto, placeholder]);

  // Request permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Need gallery permission to upload photo.');
      return false;
    }
    return true;
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ new syntax
        allowsEditing: allowCrop,
        aspect: aspectRatio,
        quality: imageQuality,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];

        // Check file size
        if (selectedImage.fileSize && selectedImage.fileSize > maxFileSize) {
          Alert.alert(
            'File Too Large',
            `Please select an image smaller than ${maxFileSize / 1024 / 1024}MB`
          );
          return;
        }
       
        setTempImage(selectedImage.uri);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Need camera permission to take photo.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: allowCrop,
        aspect: aspectRatio,
        quality: imageQuality,
      });

      if (!result.canceled && result.assets[0]) {
        setTempImage(result.assets[0].uri);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  // Rotate image
  const rotateImage = async (uri, direction = 'right') => {
    try {
      const rotation = direction === 'right' ? 90 : -90;
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ rotate: rotation }],
        { compress: imageQuality, format: ImageManipulator.SaveFormat.JPEG }
      );
      setTempImage(manipResult.uri);
    } catch (error) {
      console.error('Error rotating image:', error);
      Alert.alert('Error', 'Failed to rotate image.');
    }
  };

  // Upload image
  const handleUpload = async () => {
    if (!tempImage) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      const filename = tempImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri: tempImage,
        name: `upload-${Date.now()}.jpg`,
        type,
      });
      formData.append('bucketName', folderName);
console.log("FORM DATA", formData);
      // Fake progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch(`${baseUrl}fileManager/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const text = await response.text();
        console.log('Server error:', response.status, text);
        throw new Error('Upload failed');
      }

      const data = await response.json();

      if (data.url) {
        const proxyUrl = `${PROXY_URL}${encodeURIComponent(data.url)}`;
        setImageUri(proxyUrl);
        setShowModal(false);
        setTempImage(null);
        if (onUploadSuccess) onUploadSuccess(data.url);
        Alert.alert('Success', 'Photo uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove photo
  const handleRemove = () => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setImageUri(placeholder || null);
          if (onUploadSuccess) onUploadSuccess(null);
        },
      },
    ]);
  };

  const showImagePickerOptions = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="w-full my-2.5">
      <View className="w-full h-[300px] bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="contain" />
            <View className="absolute bottom-2.5 right-2.5 flex-row gap-2">
              <TouchableOpacity
                className="flex-row items-center px-3 py-2 bg-blue-500 rounded-lg gap-1.5"
                onPress={showImagePickerOptions}
              >
                <Ionicons name="images-outline" size={20} color="#fff" />
                <Text className="text-white text-sm font-semibold">Change</Text>
              </TouchableOpacity>
              {existingPhoto && (
                <TouchableOpacity
                  className="flex-row items-center px-3 py-2 bg-red-500 rounded-lg gap-1.5"
                  onPress={handleRemove}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text className="text-white text-sm font-semibold">Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <TouchableOpacity
            className="flex-1 justify-center items-center p-5"
            onPress={showImagePickerOptions}
          >
            <Ionicons name="image-outline" size={80} color="#999" />
            <Text className="mt-3 text-base text-gray-600 font-medium">Tap to upload photo</Text>
            <Text className="mt-1 text-xs text-gray-400">
              Max size: {maxFileSize / 1024 / 1024}MB
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Preview Modal */}
      <Modal visible={showModal} animationType="slide">
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setTempImage(null);
              }}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Preview</Text>
            <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <Ionicons name="checkmark" size={28} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Preview Image */}
          <View className="flex-1 bg-black justify-center items-center">
            {tempImage && (
              <Image
                source={{ uri: tempImage }}
                style={{ width: SCREEN_WIDTH, height: '100%' }}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Rotate Buttons */}
          {allowRotation && (
            <View className="flex-row justify-around py-4 bg-gray-50 border-t border-gray-300">
              <TouchableOpacity onPress={() => rotateImage(tempImage, 'left')} disabled={isUploading}>
                <Ionicons name="refresh-outline" size={24} color="#007AFF" />
                <Text className="mt-1 text-xs text-blue-500 text-center">Rotate Left</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => rotateImage(tempImage, 'right')} disabled={isUploading}>
                <Ionicons name="refresh" size={24} color="#007AFF" />
                <Text className="mt-1 text-xs text-blue-500 text-center">Rotate Right</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <View className="px-5 py-3 bg-gray-50">
              <Text className="text-sm text-gray-600 mb-2 text-center">
                Uploading... {uploadProgress}%
              </Text>
              <View className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ExpoPhotoUploader;
