import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
} from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  ToastAndroid,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import {
  useUploadImageMutation,
  useUploadAvatarMutation,
  useUploadProductImageMutation,
  useFileManagerUploadMutation,
  type UploadResponse,
  type FileUploadResponse,
} from "../store/api/uploadApi";
import { PHOTO_URL, BASE_URL } from "../constants/baseUrl";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useUpdateUserMutation } from "@/store/api/userApi";
import { setUserInfo } from "@/store/slice/userSlice";

const defaultImage = require("../assets/images/logo-h.png");

// Get device width
const DEVICE_WIDTH = Dimensions.get("window").width;

// Define standard aspect ratios
type AspectRatioPreset =
  | "1:1"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16"
  | "3:2"
  | "2:3";
type OrientationType = "portrait" | "landscape" | "auto";
type CropMode = "aspectRatio" | "exactSize";
type UploadType = "general" | "avatar" | "product" | "fileManager";

// Define ref methods that will be exposed to parent components
export interface PhotoUploadRef {
  upload: () => Promise<unknown | null>;
  pickImage: (source: "camera" | "library") => Promise<void>;
  removeImage: () => void;
  getImageUri: () => string | null;
}

// Fix the TypeScript error by updating the interface
interface PhotoUploadProps {
  onImageSelected?: (uri: string | null) => void;
  initialImage?: string | null;
  aspectRatio?: number;
  className?: string;
  height?: number;
  width?: number;
  cropWidth?: number;
  cropHeight?: number;
  allowCropping?: boolean;
  quality?: number;
  aspectRatioPreset?: AspectRatioPreset;
  orientation?: OrientationType;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
  outputWidth?: number;
  outputHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  displayWidth?: number | "100%";
  displayHeight?: number;
  allowDimensionControl?: boolean;
  cropMode?: CropMode;
  isAvatar?: boolean;
  apiUrl?: string; // Deprecated - now using Redux API
  apiHeaders?: Record<string, string>; // Deprecated - now using Redux API
  uploadType?: UploadType; // Type of upload (general, avatar, product, fileManager)
  bucketName?: string; // Folder name for fileManager uploads
  onUploadSuccess?: (response: unknown) => void; // Callback after successful upload
  onUploadError?: (error: unknown) => void; // Callback after failed upload
  requireConfirmation?: boolean; // Require confirmation before applying image
  showUploadButton?: boolean; // Whether to show the upload button when image is selected
  extraFormData?: Record<string, string>; // Additional form data to include in upload
}

const PhotoUpload = forwardRef<PhotoUploadRef, PhotoUploadProps>(
  (
    {
      onImageSelected,
      initialImage = null,
      aspectRatio,
      className = "",
      height = 200,
      width,
      cropWidth,
      cropHeight,
      allowCropping = true,
      quality = 0.8,
      aspectRatioPreset = "1:1",
      orientation = "auto",
      resizeMode = "cover",
      outputWidth,
      outputHeight,
      maxWidth = 1200,
      maxHeight = 1200,
      displayWidth = "100%",
      displayHeight,
      allowDimensionControl = false,
      cropMode = "aspectRatio",
      isAvatar = false,
      apiUrl, // Kept for backward compatibility
      apiHeaders = {},
      uploadType = "general",
      bucketName = "uploads", // Default folder for uploads
      onUploadSuccess,
      onUploadError,
      requireConfirmation = false,
      showUploadButton = true,
      extraFormData = {},
    }: PhotoUploadProps,
    ref,
  ) => {
    // Initialize with two separate variables:
    // - displayImage: for preview display only (shows userInfo photo or uploaded result)
    // - selectedImage: temporary selected image waiting for upload
    const [displayImage, setDisplayImage] = useState<string | null>(null); // For display/preview
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // For selection before upload
    const [previewImage, setPreviewImage] = useState<string | null>(null); // For confirmation modal
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAspectRatio, setSelectedAspectRatio] =
      useState<AspectRatioPreset>(aspectRatioPreset);
    const [selectedOrientation, setSelectedOrientation] =
      useState<OrientationType>(orientation);
    const [showCropOptions, setShowCropOptions] = useState(false);
    const [showDimensionOptions, setShowDimensionOptions] = useState(false);
    const [customWidth, setCustomWidth] = useState(
      outputWidth?.toString() || "",
    );
    const [customHeight, setCustomHeight] = useState(
      outputHeight?.toString() || "",
    );
    const [customDisplayWidth, setCustomDisplayWidth] = useState(
      typeof displayWidth === "number" ? displayWidth.toString() : "",
    );
    const [customDisplayHeight, setCustomDisplayHeight] = useState(
      displayHeight?.toString() || "",
    );
    const [selectedCropMode, setSelectedCropMode] =
      useState<CropMode>(cropMode);

    const { userInfo, dispatch } = useGlobalContext();
    const [updateUser] = useUpdateUserMutation();

    // Debug the initial mount
    useEffect(() => {
      console.log("PhotoUploader mounted");
      console.log("Initial image:", initialImage);
      console.log("Is avatar mode:", isAvatar);
      console.log("userInfo?.photo:", userInfo?.photo);
    }, [initialImage, isAvatar, userInfo?.photo]);

    // Load user photo initially for display
    useEffect(() => {
      if (userInfo?.photo && isAvatar) {
        try {
          const photoUrl = `${PHOTO_URL}/api/fileManager/photo-url/${encodeURIComponent(userInfo.photo as string)}`;
          // console.log("Loading user photo for display:", photoUrl);
          setDisplayImage(photoUrl); // Set the display image, not the selected image
        } catch (error) {
          console.error("Error loading user photo:", error);
        }
      } else if (initialImage) {
        setDisplayImage(initialImage);
      }
    }, [userInfo?.photo, isAvatar, initialImage]);

    // Debug log to check image states
    // useEffect(() => {
    //   console.log("Display image state:", displayImage ? "Set" : "Not set");
    //   console.log("Selected image state:", selectedImage ? "Set" : "Not set");
    // }, [displayImage, selectedImage]);

    // Force 1:1 aspect ratio when in avatar mode
    useEffect(() => {
      if (isAvatar) {
        setSelectedAspectRatio("1:1");
      }
    }, [isAvatar]);

    // Sync crop dimensions with output dimensions when using exact size mode
    useEffect(() => {
      if (selectedCropMode === "exactSize" && outputWidth && outputHeight) {
        setCustomWidth(outputWidth.toString());
        setCustomHeight(outputHeight.toString());
      }
    }, [selectedCropMode, outputWidth, outputHeight]);

    // Parse aspect ratio presets to numbers
    const getAspectRatioValues = (
      preset: AspectRatioPreset,
    ): [number, number] => {
      const [width, height] = preset.split(":").map(Number);
      return [width, height];
    };

    // Get effective aspect ratio based on preset and orientation
    const getEffectiveAspectRatio = (): [number, number] => {
      // Force 1:1 for avatar
      if (isAvatar) {
        return [1, 1];
      }

      const [widthValue, heightValue] =
        getAspectRatioValues(selectedAspectRatio);

      // If orientation is portrait, invert the ratio if it's landscape
      if (selectedOrientation === "portrait" && widthValue > heightValue) {
        return [heightValue, widthValue];
      }

      // If orientation is landscape, invert the ratio if it's portrait
      if (selectedOrientation === "landscape" && heightValue > widthValue) {
        return [heightValue, widthValue];
      }

      return [widthValue, heightValue];
    };

    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images.",
          [{ text: "OK", style: "default" }],
        );
        return false;
      }
      return true;
    };

    const requestCameraPermission = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please allow access to your camera to take photos.",
          [{ text: "OK", style: "default" }],
        );
        return false;
      }
      return true;
    };

    // Function to crop image to exact dimensions
    const cropToExactSize = async (uri: string): Promise<string> => {
      try {
        // Get target dimensions
        const targetWidth = customWidth
          ? Number.parseInt(customWidth, 10)
          : outputWidth;
        const targetHeight = customHeight
          ? Number.parseInt(customHeight, 10)
          : outputHeight;

        if (!targetWidth || !targetHeight) {
          return uri; // No dimensions specified
        }

        // Get image dimensions to calculate crop
        const { width: imgWidth, height: imgHeight } = await new Promise<{
          width: number;
          height: number;
        }>((resolve) => {
          Image.getSize(
            uri,
            (width, height) => {
              resolve({ width, height });
            },
            (error) => {
              console.error("Failed to get image size:", error);
              resolve({ width: 0, height: 0 });
            },
          );
        });

        // Calculate crop dimensions to match target aspect ratio
        const targetAspect = targetWidth / targetHeight;
        const imgAspect = imgWidth / imgHeight;

        // Declare variables separately with proper types
        let cropWidth: number;
        let cropHeight: number;
        let originX: number;
        let originY: number;

        if (imgAspect > targetAspect) {
          // Image is wider than target, crop width
          cropHeight = imgHeight;
          cropWidth = imgHeight * targetAspect;
          originX = (imgWidth - cropWidth) / 2;
          originY = 0;
        } else {
          // Image is taller than target, crop height
          cropWidth = imgWidth;
          cropHeight = imgWidth / targetAspect;
          originX = 0;
          originY = (imgHeight - cropHeight) / 2;
        }

        // First crop to the right aspect ratio
        const aspectRatioActions: ImageManipulator.Action[] = [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ];

        const croppedResult = await ImageManipulator.manipulateAsync(
          uri,
          aspectRatioActions,
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
        );

        // Then resize to the exact dimensions
        const resizeActions: ImageManipulator.Action[] = [
          { resize: { width: targetWidth, height: targetHeight } },
        ];

        const finalResult = await ImageManipulator.manipulateAsync(
          croppedResult.uri,
          resizeActions,
          { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
        );

        return finalResult.uri;
      } catch (error) {
        console.error("Image crop error:", error);
        return uri; // Return original if crop fails
      }
    };

    const resizeImage = async (uri: string): Promise<string> => {
      try {
        const targetWidth = customWidth
          ? Number.parseInt(customWidth, 10)
          : outputWidth;
        const targetHeight = customHeight
          ? Number.parseInt(customHeight, 10)
          : outputHeight;

        // If using exact size crop mode, use the dedicated function
        if (selectedCropMode === "exactSize" && targetWidth && targetHeight) {
          return await cropToExactSize(uri);
        }

        // If no dimensions specified, check if we need to resize based on max dimensions
        if (!targetWidth && !targetHeight) {
          // Get image dimensions
          const { width, height } = await new Promise<{
            width: number;
            height: number;
          }>((resolve) => {
            Image.getSize(
              uri,
              (width, height) => {
                resolve({ width, height });
              },
              (error) => {
                console.error("Failed to get image size:", error);
                resolve({ width: 0, height: 0 });
              },
            );
          });

          // Skip resizing if image is already smaller than max dimensions
          if (
            maxWidth &&
            width <= maxWidth &&
            maxHeight &&
            height <= maxHeight
          ) {
            return uri;
          }

          // Calculate resize dimensions while maintaining aspect ratio
          const aspectRatio = width / height;
          let newWidth = width;
          let newHeight = height;

          if (maxWidth && width > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
          }

          if (maxHeight && newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
          }

          const actions: ImageManipulator.Action[] = [
            { resize: { width: newWidth, height: newHeight } },
          ];

          const result = await ImageManipulator.manipulateAsync(uri, actions, {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
          });

          return result.uri;
        }

        // If specific dimensions provided, resize to those exact dimensions
        const actions: ImageManipulator.Action[] = [];

        if (targetWidth && targetHeight) {
          actions.push({
            resize: { width: targetWidth, height: targetHeight },
          });
        } else if (targetWidth) {
          actions.push({ resize: { width: targetWidth } });
        } else if (targetHeight) {
          actions.push({ resize: { height: targetHeight } });
        }

        if (actions.length === 0) {
          return uri; // No resize needed
        }

        const result = await ImageManipulator.manipulateAsync(uri, actions, {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        });

        return result.uri;
      } catch (error) {
        console.error("Image resize error:", error);
        return uri; // Return original if resize fails
      }
    };

    /**
     * Upload image using the FileManager API endpoint with FileSystem.uploadAsync
     * This is a completely different implementation that may work better with network issues
     */
    const uploadWithFileManager = async (
      imageUri: string,
    ): Promise<unknown | null> => {
      try {
        // Exit early if no image
        if (!imageUri) {
          Platform.OS === "android"
            ? ToastAndroid.show("No image selected", ToastAndroid.SHORT)
            : Alert.alert("Error", "No image to upload");
          return null;
        }

        // Set uploading state
        setIsUploading(true);

        // Create a unique filename
        const fileName = `cropped-${Date.now()}.jpg`;

        // Try using FileSystem.uploadAsync instead of axios
        // This method has better native support for file uploads
        const uploadUrl = `${BASE_URL}/fileManager/upload`;

        // console.log("Uploading to:", uploadUrl);
        // console.log("Image URI:", imageUri);
        // console.log("BucketName:", userInfo?.aamarId);

        // Use FileSystem.uploadAsync which has better native performance
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, imageUri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "photo", // Field name for the file
          mimeType: "image/jpeg",
          parameters: {
            // Add additional form parameters
            bucketName: userInfo?.aamarId || "",
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Upload complete status:", uploadResult?.status);

        if (uploadResult.status >= 200 && uploadResult.status < 300) {
          // Parse the response
          let responseData: Record<string, unknown>;
          try {
            responseData = JSON.parse(uploadResult.body);
            // console.log("Upload response:", responseData);

            // Handle the successful upload (updates context, shows notification)
            await handleSuccessfulUpload(responseData);

            return responseData;
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            console.log("Raw response:", uploadResult.body);
            throw new Error("Invalid response from server");
          }
        }

        // Handle HTTP error - this code only runs if the status code is not 2xx
        console.error("Upload failed with HTTP status:", uploadResult.status);
        console.error("Response body:", uploadResult.body);
        throw new Error(`HTTP error ${uploadResult.status}`);
      } catch (error) {
        console.error("File upload error:", error);

        if (onUploadError) {
          onUploadError(error);
        }

        // Show error notification
        Platform.OS === "android"
          ? ToastAndroid.show("Upload failed", ToastAndroid.SHORT)
          : Alert.alert(
              "Upload Failed",
              "Failed to upload image. Please check your internet connection and try again.",
            );

        return null;
      } finally {
        setIsUploading(false);
      }
    };

    /**
     * Directly upload the current image
     * This can be exposed to parent components via a ref
     * @returns Promise that resolves to the upload response or null if there's no image/URL
     */
    const uploadCurrentImage = async (): Promise<unknown | null> => {
      if (!selectedImage) {
        Platform.OS === "android"
          ? ToastAndroid.show("No image selected", ToastAndroid.SHORT)
          : Alert.alert("No Image", "Please select an image first");
        return null;
      }

      setIsUploading(true);
      try {
        const result = await uploadWithFileManager(selectedImage);
        return result;
      } catch (error) {
        if (onUploadError) {
          onUploadError(error);
        }
        console.error("Error uploading image:", error);

        // Show error notification
        Platform.OS === "android"
          ? ToastAndroid.show("Upload failed", ToastAndroid.SHORT)
          : Alert.alert("Error", "Failed to upload image");

        return null;
      } finally {
        setIsUploading(false);
      }
    };

    const handleImagePick = async (source: "camera" | "library") => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const hasPermission =
          source === "camera"
            ? await requestCameraPermission()
            : await requestPermission();

        if (!hasPermission) return;

        setIsLoading(true);

        // Configure crop dimensions based on props and mode
        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: allowCropping,
          quality,
        };

        // When using exact size mode, try to match the crop preview to the final dimensions
        if (selectedCropMode === "exactSize") {
          const targetWidth = customWidth
            ? Number.parseInt(customWidth, 10)
            : outputWidth;
          const targetHeight = customHeight
            ? Number.parseInt(customHeight, 10)
            : outputHeight;

          if (targetWidth && targetHeight) {
            options.aspect = [targetWidth, targetHeight];
          }
        } else {
          // Use traditional aspect ratio approach
          if (cropWidth && cropHeight) {
            options.aspect = [cropWidth, cropHeight];
          } else if (allowCropping) {
            const [width, height] = getEffectiveAspectRatio();
            options.aspect = [width, height];
          } else if (aspectRatio) {
            options.aspect = [aspectRatio * 100, 100];
          }
        }

        const result =
          source === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled) {
          let selectedImage = result.assets[0].uri;

          // Resize/crop the image based on mode
          if (
            selectedCropMode === "exactSize" ||
            customWidth ||
            customHeight ||
            outputWidth ||
            outputHeight ||
            maxWidth ||
            maxHeight
          ) {
            selectedImage = await resizeImage(selectedImage);
          }

          // If confirmation is required, show preview first
          if (requireConfirmation) {
            setPreviewImage(selectedImage);
            setModalVisible(false);
            setConfirmModalVisible(true);
          } else {
            handleImageConfirm(selectedImage);
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to pick image. Please try again.");
        console.error("Image picker error:", error);
      } finally {
        setIsLoading(false);
        if (!requireConfirmation) {
          setModalVisible(false);
        }
      }
    };

    // Handle the confirmed image - apply it and upload if API URL provided
    const handleImageConfirm = async (pickedImage: string) => {
      // Set the selected image (waiting for upload)
      setSelectedImage(pickedImage);
      setConfirmModalVisible(false);

      // Call the callback with the selected image
      if (onImageSelected) {
        onImageSelected(pickedImage);
      }

      // Auto-upload if configured
      if ((apiUrl || uploadType) && !requireConfirmation) {
        await uploadCurrentImage();
      }
    };

    // Cancel the confirmation and go back to selection
    const handleImageCancel = () => {
      setPreviewImage(null);
      setConfirmModalVisible(false);
      setModalVisible(true);
    };

    const removeImage = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Remove Image",
        "Are you sure you want to remove this image?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              console.log("Removing selected image");
              setSelectedImage(null);
              if (onImageSelected) {
                onImageSelected(null);
              }
            },
          },
        ],
      );
    };

    // Calculate container width to not exceed device width and account for padding
    const containerWidth = (() => {
      // Account for padding (8px on each side from the px-2 class)
      const availableWidth = DEVICE_WIDTH - 16;

      if (typeof displayWidth === "number") {
        // If explicit width is set, use it but cap at available width
        return Math.min(displayWidth, availableWidth);
      }

      // Default to 100% of available width
      return availableWidth;
    })();

    // Get container dimensions
    const containerStyle = {
      width: containerWidth,
      height: displayHeight || height,
      alignSelf: "center" as const, // Center the container
      borderRadius: isAvatar ? 9999 : 12, // Make it fully rounded for avatar mode
    };

    // Get readable version of current crop mode
    const getCropModeDescription = () => {
      if (selectedCropMode === "exactSize") {
        const width = customWidth || outputWidth;
        const height = customHeight || outputHeight;
        return width && height ? `${width}×${height}px` : "Exact Size";
      }
      return `${selectedAspectRatio} • ${selectedOrientation !== "auto" ? selectedOrientation : "auto"}`;
    };

    const handleConfirmButtonPress = () => {
      if (previewImage) {
        handleImageConfirm(previewImage);
      } else {
        setConfirmModalVisible(false);
      }
    };

    // Expose methods to parent component via useImperativeHandle
    useImperativeHandle(ref, () => ({
      upload: uploadCurrentImage,
      pickImage: handleImagePick,
      removeImage,
      getImageUri: () => selectedImage,
    }));

    // Fix for linter error - create a properly typed update function with proper API interface
    const updateUserProfile = async (userId: string, photoUrl: string) => {
      try {
        console.log("Updating user profile photo for ID:", userId);
        console.log("New photo URL:", photoUrl);

        // Use a specific type instead of 'any'
        interface UserUpdatePayload {
          _id: string;
          [key: string]: unknown; // Allow dynamic properties for various update fields
        }

        const updatePayload: UserUpdatePayload = {
          _id: userId,
          photo: photoUrl,
        };

        // Make the API call - use a type assertion for API flexibility
        const result = await updateUser(updatePayload as any).unwrap();
        console.log("User profile update response:", result);

        // Update global context
        setUserInfo({
          ...userInfo,
          photo: photoUrl,
        });

        // Show update success message
        Platform.OS === "android"
          ? ToastAndroid.show("Profile photo updated", ToastAndroid.SHORT)
          : Alert.alert("Success", "Profile photo updated successfully");
      } catch (error) {
        console.error("Failed to update user profile:", error);
        // Show error message
        Platform.OS === "android"
          ? ToastAndroid.show("Failed to update profile", ToastAndroid.SHORT)
          : Alert.alert("Error", "Failed to update profile photo");
      }
    };

    // After successful image upload, update context and reset UI
    const handleSuccessfulUpload = async (
      responseData: Record<string, unknown>,
    ) => {
      if (responseData.url) {
        // Create the full proxy URL for the uploaded image
        const proxyUrl = `${PHOTO_URL}/api/fileManager/photo-url/${encodeURIComponent(responseData.url as string)}`;
        console.log("Setting display image after upload:", proxyUrl);

        // Update the displayImage to show the uploaded image
        setDisplayImage(proxyUrl);

        // Clear the selectedImage to show camera button again
        setSelectedImage(null);

        // For other non-avatar uploads, just update onImageSelected callback
        if (onUploadSuccess) {
          onUploadSuccess(responseData);
        }

        // Show success notification
        Platform.OS === "android"
          ? ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT)
          : Alert.alert("Success", "Image uploaded successfully");
      }
    };

    return (
      <View className={`mt-4 px-2 ${className}`}>
        {/* Container for image with separate button container to prevent overflow issues */}
        <View className="relative">
          {/* Image container */}
          <View
            className={`items-center border border-slate-200 overflow-hidden ${isAvatar ? "rounded-full" : "rounded-xl"}`}
            style={containerStyle}
          >
            {isLoading && (
              <View className="absolute z-10 w-full h-full flex items-center justify-center bg-black/20">
                <ActivityIndicator size="large" color="#FF6A39" />
              </View>
            )}

            {/* Upload progress indicator */}
            {isUploading && (
              <View className="absolute z-10 w-full h-full flex items-center justify-center bg-black/50">
                <View className="bg-white px-6 py-4 rounded-xl items-center">
                  <ActivityIndicator size="large" color="#FF6A39" />
                  <Text className="text-gray-800 mt-2 font-medium">
                    Uploading...{" "}
                    {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                  </Text>
                </View>
              </View>
            )}

            <Image
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : displayImage
                    ? { uri: displayImage }
                    : defaultImage
              }
              style={{
                width: "100%",
                height: "100%",
                resizeMode,
                borderRadius: isAvatar ? 9999 : 0,
              }}
              onError={(error) => {
                console.error("Image failed to load:", error.nativeEvent.error);
                // If image fails to load, reset
                if (selectedImage) {
                  setSelectedImage(null);
                } else if (displayImage) {
                  setDisplayImage(null);
                }
              }}
            />

            {/* Overlay for buttons - always rendered */}
            <View
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                flexDirection: "row",
                gap: 10,
                zIndex: 99999, // Increased z-index
                elevation: 10, // Added elevation for Android
                width: "auto", // Ensure width is based on content
                height: "auto", // Ensure height is based on content
                pointerEvents: "box-none", // Allow touch events to pass through
              }}
            >
              {/* Show camera button when no selected image (regardless of display image) */}
              {!selectedImage && !isUploading && (
                <TouchableOpacity
                  onPress={() => {
                    console.log("Camera button pressed");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setModalVisible(true);
                  }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: 12,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "rgba(255, 106, 57, 0.5)",
                    elevation: 6, // Increased elevation
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 }, // Increased shadow
                    shadowOpacity: 0.3, // Increased shadow opacity
                    shadowRadius: 4, // Increased shadow radius
                    zIndex: 99999, // Ensure button is above other elements
                  }}
                >
                  <Ionicons name="camera" size={28} color="#FF6A39" />{" "}
                  {/* Slightly larger icon */}
                </TouchableOpacity>
              )}

              {/* Only show remove and upload buttons when a selected image exists */}
              {selectedImage && !isUploading && (
                <>
                  {/* Upload button */}
                  {(apiUrl || uploadType) && showUploadButton && (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Upload button pressed");
                        uploadCurrentImage();
                      }}
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: 12,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: "rgba(255, 106, 57, 0.5)",
                        elevation: 6, // Increased elevation
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 }, // Increased shadow
                        shadowOpacity: 0.3, // Increased shadow opacity
                        shadowRadius: 4, // Increased shadow radius
                        zIndex: 99999, // Ensure button is above other elements
                      }}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={28}
                        color="#FF6A39"
                      />{" "}
                      {/* Slightly larger icon */}
                    </TouchableOpacity>
                  )}

                  {/* Remove button */}
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Remove button pressed");
                      removeImage();
                    }}
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: 12,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: "rgba(255, 106, 57, 0.5)",
                      elevation: 6, // Increased elevation
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 3 }, // Increased shadow
                      shadowOpacity: 0.3, // Increased shadow opacity
                      shadowRadius: 4, // Increased shadow radius
                      zIndex: 99999, // Ensure button is above other elements
                    }}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={28}
                      color="#FF6A39"
                    />{" "}
                    {/* Slightly larger icon */}
                  </TouchableOpacity>
                </>
              )}

              {/* Show spinner during upload */}
              {isUploading && (
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: 12,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "rgba(255, 106, 57, 0.5)",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                  }}
                >
                  <ActivityIndicator size="small" color="#FF6A39" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Image selection modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => setModalVisible(false)}
              className="flex-1 justify-center items-center w-full m-4"
            >
              <View className="flex bg-white p-5 rounded-2xl w-full min-h-64">
                <View className="items-center w-full pb-4 mb-5 m-4">
                  <Text className="text-lg font-semibold text-center">
                    Upload {isAvatar ? "Avatar" : "Photo"}
                  </Text>
                  {allowCropping && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {getCropModeDescription()}
                    </Text>
                  )}
                </View>

                {/* Modern horizontal button layout */}
                <View className="flex-row justify-center mb-10 gap-3">
                  <TouchableOpacity
                    onPress={() => handleImagePick("camera")}
                    className="flex-1 items-center bg-blue-50 py-4 px-2 rounded-xl"
                    style={styles.actionButton}
                  >
                    <Ionicons name="camera" size={28} color="#3b82f6" />
                    <Text className="text-sm font-medium mt-2 text-blue-600">
                      Take Photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleImagePick("library")}
                    className="flex-1 items-center bg-green-50 py-4 px-2 rounded-xl"
                    style={styles.actionButton}
                  >
                    <Ionicons name="images" size={28} color="#10b981" />
                    <Text className="text-sm font-medium mt-2 text-green-600">
                      Gallery
                    </Text>
                  </TouchableOpacity>

                  {selectedImage && (
                    <TouchableOpacity
                      onPress={removeImage}
                      className="flex-1 items-center bg-red-50 py-4 px-2 rounded-xl"
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash" size={28} color="#ef4444" />
                      <Text className="text-sm font-medium mt-2 text-red-500">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setModalVisible(false);
                  }}
                  className="items-center py-3 bg-slate-100 rounded-xl"
                  style={styles.cancelButton}
                >
                  <Text className="text-slate-600 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </BlurView>
        </Modal>

        {/* Image confirmation modal */}
        <Modal visible={confirmModalVisible} transparent animationType="fade">
          <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => setConfirmModalVisible(false)}
              className="flex-1 justify-center items-center w-full m-4"
            >
              <View className="flex bg-white p-5 rounded-2xl w-full">
                <View className="items-center w-full pb-4 mb-3">
                  <Text className="text-lg font-semibold text-center">
                    Confirm {isAvatar ? "Avatar" : "Photo"}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Use this {isAvatar ? "avatar" : "photo"}?
                  </Text>
                </View>

                {/* Preview of the selected image */}
                <View
                  className={`w-full aspect-square mb-5 overflow-hidden ${isAvatar ? "rounded-full self-center" : "rounded-xl"}`}
                  style={{
                    maxWidth: 300,
                    maxHeight: 300,
                    alignSelf: "center",
                  }}
                >
                  {previewImage && (
                    <Image
                      source={{ uri: previewImage }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: isAvatar ? 9999 : 12,
                      }}
                      resizeMode="cover"
                    />
                  )}
                </View>

                {/* Action buttons */}
                <View className="flex-row gap-3 mt-2">
                  <TouchableOpacity
                    onPress={handleImageCancel}
                    className="flex-1 items-center py-3 bg-gray-100 rounded-xl"
                    style={styles.actionButton}
                  >
                    <Text className="text-gray-700 font-medium">
                      Choose Another
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirmButtonPress}
                    className="flex-1 items-center py-3 bg-primary rounded-xl"
                    style={styles.actionButton}
                  >
                    <Text className="text-white font-medium">
                      {apiUrl ? "Save & Upload" : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </BlurView>
        </Modal>
      </View>
    );
  },
);

export default PhotoUpload;

const styles = StyleSheet.create({
  uploadButton: {
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
  },
  cancelButton: {
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 1,
  },
});
