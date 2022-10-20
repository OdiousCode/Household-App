import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { get, getDatabase, push, query, ref, set } from "firebase/database";
import { Task } from "react-native";
import { Household, Profile, TaskHistory } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState, useAppSelector } from "../store";

interface TaskState {
  isLoading: boolean;
  error: string;

  householdTasks?: Task[];
  hoseholdtaskHistory?: TaskHistory[];
}

const initialState: TaskState = {
  isLoading: false,
  error: "",

  householdTasks: undefined,
  hoseholdtaskHistory: undefined,
};

//TODO https://redux.js.org/usage/deriving-data-selectors
export const selectUserProfiles = (state: AppState) => {
  const returnUserProfiles = state.profiles.profiles.filter(
    (p) => p.userId === state.user.user?.uid
  );
  return returnUserProfiles;
};

//const selectHouseholdProfiles;

export const getUserTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string; state: AppState }
>("profiles/getUserProfiles", async (_, thunkApi) => {
  try {
    const state = thunkApi.getState();
    state.user.user?.uid;

    const db = getDatabase(app);

    const reference = ref(db, "app/profiles");
    const queryResult = query(reference);
    const snapshot = await get(queryResult);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    // mby dosent work
    throw "Snapshot does not exists";
  } catch (error) {
    console.error(error);
    if (error instanceof FirebaseError) {
      return thunkApi.rejectWithValue(error.message);
    }
    return thunkApi.rejectWithValue(
      "Could not signup please contact our support."
    );
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserTasks.pending, (state) => {
      state.isLoading = true;
      console.log("pending");
    });
    builder.addCase(getUserTasks.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.isLoading = false;
      state.householdTasks = action.payload;
    });
    builder.addCase(getUserTasks.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const profileReducer = profileSlice.reducer;