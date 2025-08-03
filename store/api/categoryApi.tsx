import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../../models/categoryModel';

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL)

export const CategoryApi = createApi({
    reducerPath: "CategoryApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        categories: builder.query<Category[], void>({
            query: () => '/category',
            providesTags: ['Category']
        }),
        // new
        masterCategoryList: builder.query<Category[], any>({
        query: ({ limit,aamarId,q }) => `/mobileApp/category/all/${limit}/${aamarId}/${q}`,
        providesTags: ["Category"],
        }),
        categoryList: builder.query<Category[], any>({
        query: ({ aamarId,limit,mcId,q }) => `/mobileApp/subCategory/all/${limit}/${aamarId}/${mcId}/${q}`,
        providesTags: ["Category"],
        }), 
        category: builder.query<Category, string>({
            query: ({id}) => `/category/${id}`,
            providesTags: ['Category']
        }),
        addCategory: builder.mutation<{}, Category>({
            query: Category => ({
                url: 'mobileApp/category/create',
                method: 'POST',
                body: Category
            }),
            invalidatesTags: ['Category']
        }),
        updateCategory: builder.mutation<void, Category>({
            query: ({ _id, ...rest }) => ({
                url: `mobileApp/category/update/${_id}`,
                method: 'PUT',
                body: rest
            }),
            invalidatesTags: ['Category']
        }),
        // new
        categoriesExport: builder.query<Category[], void>({
            query: () => '/category/export',
            providesTags: ['Category']
        }),
       
        masterCategory: builder.query<Category[], void>({
            query: () => `/category/master`,
            providesTags: ['Category']
        }),
        categoryPagenation: builder.query<Category, any>({
            query: ({ page, size, q }) => `/category/all/${page}/${size}?q=${q}`,
            providesTags: ['Category']
        }),

        categoryCount: builder.query<Category[], void>({
            query: () => '/category/count',
            providesTags: ['Category']
        }),
        
        uploadCategoryPhoto: builder.mutation<any, any>({
            query: ({ _id, ...rest }) => ({
                url: `/category/photo/${_id}`,
                method: 'POST',
                headers: {
                    'content-type': 'multipart/form-data',
                },
                body: rest
            }),
            invalidatesTags: ['Category']
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category']
        })
    })
})

export const {
    // new
    useMasterCategoryListQuery,
    useCategoryListQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    // new
    useCategoriesQuery,
    useCategoriesExportQuery,
    useCategoryQuery,
    useMasterCategoryQuery,
    useUploadCategoryPhotoMutation,
    useDeleteCategoryMutation,
    useCategoryPagenationQuery,
    useCategoryCountQuery
} = CategoryApi;

export default CategoryApi;