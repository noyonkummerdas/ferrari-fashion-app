import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/baseUrl";
import { User } from "../../models/userModel";

// console.log("BASE_URL",BASE_URL)
export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // new
    Users: builder.query<User[], any>({
      query: () => `/user`,
      providesTags: ["User"],
    }),
    User: builder.query<User, string>({
      query: ({ _id }) => `/user/${_id}`,
      providesTags: ["User"],
    }),
    addUser: builder.mutation<void, User>({
      query: (user) => ({
        url: "/user",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<void, User>({
      query: ({ _id, ...rest }) => ({
        url: `/user/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["User"],
    }),
    // new

    UserDw: builder.query<User, string>({
      query: () => `/user/Dw`,
      providesTags: ["User"],
    }),
    BillerDw: builder.query<User, string>({
      query: (warehouse) => `/user/biller/${warehouse}`,
      providesTags: ["User"],
    }),
    ManagerDw: builder.query<User, string>({
      query: () => `/user/manager`,
      providesTags: ["User"],
    }),
    loginUser: builder.mutation<{}, User>({
      query: (user) => ({
        url: "/user/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    validUser: builder.mutation<{}, User>({
      query: (user) => ({
        url: "/user/valid",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    // updateUser: builder.mutation<void, User>({
    //   query: ({ _id, ...rest }) => ({
    //     url: `/user/${_id}`,
    //     method: "PUT",
    //     body: rest,
    //   }),
    //   invalidatesTags: ["User"],
    // }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUsersQuery,
  useUserQuery,
  useLoginUserMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useValidUserMutation,
  useDeleteUserMutation,
  useUserDwQuery,
  useBillerDwQuery,
  useManagerDwQuery,
} = UserApi;

export default UserApi;
