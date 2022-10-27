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
import {  Task, TaskHistory } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState } from "../store";


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
      id: '1',
      difficulty: 1,
      frequency: 2,
      householdId: '1',
      isArchived: false,
      name: "Diska",
      description: "Gör rent all disk",
    },
    {
      id: '2',
      difficulty: 1,
      frequency: 2,
      householdId: '1',
      isArchived: false,
      name: "Tvätta",
      description: "All vit tvätt",
    },
    {
      id: '3',
      difficulty: 1,
      frequency: 2,
      householdId: '1',
      isArchived: true,
      name: "Programmera",
      description: "Gör en hushålls-app",
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
    
    // if (!state.households.activeHouseHold) {
    //   throw "no active household";
    // }

    const db = getDatabase(app);

    const reference = ref(db, "app/taskHistories");
    const queryResult = query(
      reference,
      orderByChild("householdId"),
      // equalTo(state.households)
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


export const createHouseholdTask = createAsyncThunk<Task , Task,{rejectValue:string; state: AppState}>("tasks/createHouseholdTask", async (p, thunkApi) => {
  try {

    //TODO if household is valid
    const state = thunkApi.getState();
    const findHouseHold = state.profiles.activeProfile?.householdId
    const db = getDatabase(app);
    const reference = ref(db, "app/tasks");
    const pushRef = push(reference);

    
    let newT: Task = {
      frequency: p.frequency,
      difficulty: p.difficulty,
      householdId: findHouseHold,
      id: pushRef.key!,
      name : p.name,
      description: p.description,
      isArchived: p.isArchived,
    };

    await set(pushRef, newT);

    return newT;
  } catch (error) {
    //TODO look at davids firebase error thingi
    return thunkApi.rejectWithValue("Could not connect to server");
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

    if (!state.profiles.activeProfile?.householdId) {
      throw "no active household";
    }

    const db = getDatabase(app);

    const reference = ref(db, "app/tasks");
    const queryResult = query(
      reference,
      orderByChild("householdId"),
      equalTo(state.profiles.activeProfile.householdId)
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

      builder.addCase(createHouseholdTask.pending, (state) => {
      state.isLoading = true;
      console.log("pending");
    });
    builder.addCase(createHouseholdTask.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.isLoading = false;
      state.householdTasks!.push(action.payload);
    });
    builder.addCase(createHouseholdTask.rejected, (state, action) => {
      console.log("rejected ");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const taskReducer = taskSlice.reducer;
