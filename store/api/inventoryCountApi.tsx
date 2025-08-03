import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { InventoryCount } from "../../models/inventoryCountModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const InventoryCountApi = createApi({
  reducerPath: "InventoryCountApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["InventoryCount"],
  endpoints: (builder) => ({
    inventories: builder.query<InventoryCount[], void>({
      query: () => "/inventoryCount",
      providesTags: ["InventoryCount"],
    }),
    inventoryCountByUser: builder.query<InventoryCount, string>({
      query: (_id) => `/inventoryCount/byUser/${_id}`,
      providesTags: ["InventoryCount"],
    }),
    inventoryCountByArticleCode: builder.query<InventoryCount, string>({
      query: (article_code) => `/inventoryCount/byArticle/${article_code}`,
      providesTags: ["InventoryCount"],
    }),
    inventoryCount: builder.query<InventoryCount, string>({
      query: (_id) => `/inventoryCount/${_id}`,
      providesTags: ["InventoryCount"],
    }),
    addInventoryCount: builder.mutation<{}, InventoryCount>({
      query: (InventoryCount) => ({
        url: "/inventoryCount",
        method: "POST",
        body: InventoryCount,
      }),
      invalidatesTags: ["InventoryCount"],
    }),
    updateInventoryCount: builder.mutation<void, any>({
      query: ({ _id, ...rest }) => ({
        url: `/inventoryCount/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["InventoryCount"],
    }),
    deleteInventoryCount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventoryCount/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryCount"],
    }),
  }),
});

export const {
  useInventoriesQuery,
  useInventoryCountQuery,
  useInventoryCountByUserQuery,
  useInventoryCountByArticleCodeQuery,
  useAddInventoryCountMutation,
  useUpdateInventoryCountMutation,
  useDeleteInventoryCountMutation,
} = InventoryCountApi;

export default InventoryCountApi;
