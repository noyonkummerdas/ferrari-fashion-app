import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Inventory } from "../../models/inventoryModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const InventoryApi = createApi({
  reducerPath: "InventoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({ 
    //new
    Inventories: builder.query<Inventory[], any>({
      query: ({aamarId,warehouse}) => `/mobileApp/inventory/all/${warehouse}/${aamarId}`,
      providesTags: ["Inventory"],
    }),
    // newEnd
    inventoryMovement: builder.query<Inventory[], any>({
      query: ({ startDate, endDate }) =>
        `/product/movement/${startDate}/${endDate}`, // not found
      // providesTags: ["Inventory"],
    }),
    InventoryExport: builder.query<Inventory[], any>({
      query: () => `/inventory/export`,
      providesTags: ["Inventory"],
    }),
    InventoryExportNew: builder.query<Inventory[], any>({
      query: () => `/inventory/export/new`, // not found
      providesTags: ["Inventory"],
    }),
    InventoriesAll: builder.query<Inventory[], any>({
      query: () => `/inventory`,
      providesTags: ["Inventory"],
    }),
    Inventory: builder.query<Inventory, string>({
      query: (_id) => `/inventory/${_id}`,
      providesTags: ["Inventory"],
    }),
    inventoryByArticle: builder.query<Inventory, string>({
      query: (article_code) => `/inventory/article_code/${article_code}`,
      providesTags: ["Inventory"],
    }),
    inventoryCount: builder.query<any, void>({
      query: () => "/inventory/count",
      providesTags: ["Inventory"],
    }),
    masterInventory: builder.query<Inventory[], void>({
      query: (_id) => `/inventory/master`, // not found
      providesTags: ["Inventory"],
    }),
    addInventory: builder.mutation<{}, Inventory>({
      query: (Inventory) => ({
        url: "/inventory",
        method: "POST",
        body: Inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    addInventoryPrice: builder.mutation<{}, Inventory>({
      query: (Inventory) => ({
        url: "/inventory/price",// not found
        method: "POST",
        body: Inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    updateInventory: builder.mutation<void, any>({
      query: ({ _id, ...rest }) => ({
        url: `/inventory/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Inventory"],
    }),
    adjustInventory: builder.mutation<void, any>({
      query: (Inventory) => ({
        url: `/inventory/adjust`,
        method: "PUT",
        body: Inventory,
      }),
      invalidatesTags: ["Inventory"],
    }),
    deleteInventory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useInventoriesQuery,
  useInventoryExportQuery,
  useInventoryExportNewQuery,
  // useInventoryInitQuery,
  useInventoriesAllQuery,
  useInventoryByArticleQuery,
  useInventoryCountQuery,
  useInventoryMovementQuery,
  useInventoryQuery,
  useMasterInventoryQuery,
  useAddInventoryMutation,
  useAddInventoryPriceMutation,
  useUpdateInventoryMutation,
  useAdjustInventoryMutation,
  useDeleteInventoryMutation,
} = InventoryApi;

export default InventoryApi;
