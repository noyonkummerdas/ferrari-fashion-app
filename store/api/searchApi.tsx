import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../models/productModel";
import { Customer } from "../../models/customerModel";

import { BASE_URL } from '../../constants/baseUrl';

console.log(BASE_URL);

export const SearchApi = createApi({
  reducerPath: "SearchApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product","Customer"],
  endpoints: (builder) => ({
    // new
    productsSearch: builder.query<Product[], any>({
      query: ({ aamarId, warehouse, searchQuery }) => `/mobileApp/search/${warehouse}/${aamarId}/${searchQuery}`,
      providesTags: ["Product"],
    }),
    productByEan: builder.query<Product, any>({
      query: ({aamarId, warehouse,ean}) => `/mobileApp/product-ean/${warehouse}/${aamarId}/${ean}`,
      providesTags: ["Product"],
    }),
    productById: builder.query<Product, any>({
      query: ({aamarId, warehouse,id}) => `/mobileApp/product-id/${warehouse}/${aamarId}/${id}`,
      providesTags: ["Product"],
    }),
    customers: builder.query<Product, any>({
      query: ({aamarId, warehouse,customer,limit}) => `/mobileApp/customers/${limit}/${warehouse}/${aamarId}/${customer}`,
      providesTags: ["Customer"],
    }),
    // new
  }),
});

export const { 
  useProductByEanQuery,
  useProductByIdQuery,
  useCustomersQuery,
  useProductsSearchQuery
 } = SearchApi;

export default SearchApi;
