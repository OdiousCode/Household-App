import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import { orderBy } from "firebase/firestore";
import { Household, Profile, Task, TaskHistory } from "../../data/APItypes";
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

  householdTasks: [
    {
      id: 1,
      difficulty: 3,
      frequency: 4,
      householdId: 1,
      isArchived: false,
      name: "Diska",
    },
  ],
  hoseholdtaskHistory: [
    {
      date: Date.now(),
      id: 77,
      profileId: 1,
      taskId: 1,
    },
  ],
};

export const getUserTaskHistories = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string; state: AppState }
>("tasks/getUserTaskHistories", async (_, thunkApi) => {
  try {
    const state = thunkApi.getState();
    state.user.user?.uid;

    if (!state.households.activeHouseHold) {
      throw "no active household";
    }

    const db = getDatabase(app);

    const reference = ref(db, "app/taskHistories");
    const queryResult = query(
      reference,
      orderByChild("householdId"),
      equalTo(state.households.activeHouseHold!.id)
    );
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

export const getUserTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string; state: AppState }
>("tasks/getUserTasks", async (_, thunkApi) => {
  try {
    const state = thunkApi.getState();
    state.user.user?.uid;

    if (!state.households.activeHouseHold) {
      throw "no active household";
    }

    const db = getDatabase(app);

    const reference = ref(db, "app/tasks");
    const queryResult = query(
      reference,
      orderByChild("householdId"),
      equalTo(state.households.activeHouseHold!.id)
    );
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

const taskSlice = createSlice({
  name: "task",
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

export const taskReducer = taskSlice.reducer;
