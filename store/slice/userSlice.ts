import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
  "id": "", 
  "name": "", 
  "phone": "", 
  "warehouse":"",
  "aamarId":"",
  "isLoggedIn": false
},
  reducers: {
    setUserInfo: (state,action) => {
        console.log("user Slice Payload:", action.payload)
      return (
        state = {
            ...state,
            "id": action.payload.id,
            "name": action.payload.name,
            "phone": action.payload.phone,
        }
      )
    },
   
  },
});

// Export the actions to use them in your components
export const { setUserInfo } = userSlice.actions;

// Export the reducer to use it in the store
export default userSlice.reducer;
