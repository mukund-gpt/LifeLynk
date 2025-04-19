import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice"; // Import the authReducer from AuthSlice

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add authReducer to the store
  },
});
