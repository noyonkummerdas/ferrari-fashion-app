import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PHOTO_URL } from "../../constants/baseUrl";

export interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
  data?: Record<string, unknown>;
}

export interface FileUploadResponse {
  url: string;
  message: string;
  fileName: string;
  status: boolean;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Add any common headers here
      return headers;
    },
  }),
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
        // Don't set Content-Type header as the browser will set it with the boundary parameter
      }),
      invalidatesTags: ["Upload"],
    }),

    uploadAvatar: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Upload"],
    }),

    uploadProductImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload/product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Upload"],
    }),

    // File manager upload endpoint (matches React implementation)
    fileManagerUpload: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: "/fileManager/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Upload"],
    }),

    deleteUploadedFile: builder.mutation<UploadResponse, { fileUrl: string }>({
      query: ({ fileUrl }) => ({
        url: "/upload/delete",
        method: "DELETE",
        body: { fileUrl },
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadAvatarMutation,
  useUploadProductImageMutation,
  useFileManagerUploadMutation,
  useDeleteUploadedFileMutation,
} = uploadApi;

export default uploadApi;
