import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { profileReducer } from "./slices/profileSlice";
import { userReducer } from "./slices/userSlice";
// import { profileReducer } from "./bankSlice";
// import { householdReducer } from "./bankSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    profiles: profileReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
