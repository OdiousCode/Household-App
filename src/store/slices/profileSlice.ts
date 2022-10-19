import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ProfileState {
  isLoading: boolean;
  error: string;

  name: string;
  id: number;
  userId: number;
  householdId: number;

  role: string; // potential interface
  avatar: number; // 0 - 5
  pending: boolean;
}

const initialState: ProfileState = {
  isLoading: false,
  error: "",

  name: "",
  id: 0,
  userId: 0,
  avatar: 0,
  householdId: 0,

  role: "User",
  pending: false,
};

export const setName = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("profile/setname", async (name, thunkApi) => {
  return thunkApi.rejectWithValue("Could not save name");
  return name;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setName.pending, (state) => {
      state.isLoading = true;
      console.log("pending");
    });
    builder.addCase(setName.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.isLoading = false;
      state.name = action.payload;
    });
    builder.addCase(setName.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const profileReducer = profileSlice.reducer;
