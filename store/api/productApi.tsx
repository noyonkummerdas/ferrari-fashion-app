import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Product } from "@/types/product";
import { BASE_URL } from "../../constants/baseUrl";

// console.log(BASE_URL);

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    addProduct: builder.mutation<{}, Product>({
      query: (product) => ({
        url: "/product",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    //new
    products: builder.query<Product[], any>({
      query: ({ q }) => `/product/search/${q}`,
      providesTags: ["Product"],
    }),

    product: builder.query<Product, any>({
      query: ({ _id }) => `/product/${_id}`,
      providesTags: ["Product"],
    }),

    updateProduct: builder.mutation<void, Product>({
      query: ({ _id, ...rest }) => ({
        url: `/product/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Product"],
    }),

    // ========================

    productsExport: builder.query<Product[], any>({
      query: ({ warehouse }) => `/product/export/${warehouse}`,
      providesTags: ["Product"],
    }),
    productCount: builder.query<Product[], void>({
      query: () => "/product/count",
      providesTags: ["Product"],
    }),
    productPopular: builder.query<Product[], void>({
      query: () => "/product/best-seller",
      providesTags: ["Product"],
    }),

    productMovement: builder.query<Product, any>({
      query: ({ startDate, endDate }) =>
        `/product/movement/:${startDate}/:${endDate}`,
      providesTags: ["Product"],
    }),

    productDetailsById: builder.query<Product[], any>({
      query: ({ id }) => `/mobileApp/product/details/${id}`,
      providesTags: ["Product"],
    }),
    uniqueAc: builder.query<Product, any>({
      query: ({ aamarId, article_code }) =>
        `/product/uniqueAc/${aamarId}/${article_code}`,
      providesTags: ["Product"],
    }),

    //new
    productPromo: builder.query<Product, string>({
      query: (_id) => `/product/promo-update/${_id}`,
      providesTags: ["Product"],
    }),
    productPrice: builder.query<Product, string>({
      query: (_id) => `/product/price/${_id}`,
      providesTags: ["Product"],
    }),
    productInfo: builder.query<Product, string>({
      query: (_id) => `/product/infoPrice/${_id}`,
      providesTags: ["Product"],
    }),
    productPagenation: builder.query<Product, any>({
      query: ({ page, size, q }) => `/product/all/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/product`,
      providesTags: ["Product"],
    }),
    productLedger: builder.query<Product, any>({
      query: ({ start, end, page, size, q }) =>
        `/product/movement/page/${start}/${end}/${page}/${size}?q=${q}`, // not found
      // query: ({page, size, q}) => `/product`,
      providesTags: ["Product"],
    }),
    productLedgerExport: builder.query<Product, any>({
      query: ({ start, end }) => `/product/movement/${start}/${end}`,
      // query: ({page, size, q}) => `/product`,
      providesTags: ["Product"],
    }),

    updateProductPrice: builder.mutation<void, Product>({
      query: ({ _id, ...rest }) => ({
        url: `/product/price/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  //new
  useUniqueAcQuery,
  useProductsQuery,
  useProductQuery,
  useProductDetailsByIdQuery,
  //new
  useProductsExportQuery,
  useProductPopularQuery,
  useProductMovementQuery,
  useProductPromoQuery,
  useProductInfoQuery,
  useProductPriceQuery,
  useProductCountQuery,
  useProductPagenationQuery,
  useProductLedgerQuery,
  useProductLedgerExportQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useUpdateProductPriceMutation,
  useDeleteProductMutation,
} = ProductApi;

export default ProductApi;
