import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set the user from the action payload
    },
    clearUser: (state) => {
      state.user = null; // Clear the user data
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
