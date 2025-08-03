import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Group } from "../../models/groupModel";

import { BASE_URL } from '../../constants/baseUrl';

export const GroupApi = createApi({
  reducerPath: "GroupApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    groups: builder.query<Group[], void>({
      query: () => "/group",
      providesTags: ["Group"],
    }),
    addGroup: builder.mutation<Group, Group>({
      query: (newGroup) => ({
        url: "/group", // Matches the `/group` route in your backend
        method: "POST", // Matches the POST method in your backend
        body: newGroup, // Sends the `req.body` as expected by your backend
      }),
      invalidatesTags: ["Group"], // Updates the cache when a new group is added
    }),
    groupById: builder.query<Group, string>({
      query: (_id) => `/group/${_id}`,
      providesTags: ["Group"],
    }),
    updateGroup: builder.mutation<void, Group>({
      query: ({ _id, ...rest }) => ({
        url: `/group/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/group/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGroupsQuery,
  useGroupByIdQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = GroupApi;

export default GroupApi;
