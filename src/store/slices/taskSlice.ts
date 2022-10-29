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
import { date } from "yup";
import { Task, TaskHistory } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState } from "../store";

interface TaskState {
  isLoading: boolean;
  error: string;

  householdTasks: Task[];
  householdtaskHistory: TaskHistory[];
}

const initialState: TaskState = {
  isLoading: false,
  error: "",

  householdTasks: [
    {
      id: "1",
      difficulty: 1,
      frequency: 2,
      householdId: "1",
      isArchived: false,
      name: "Diska",
      description: "Gör rent all disk",
    },
    {
      id: "2",
      difficulty: 1,
      frequency: 2,
      householdId: "1",
      isArchived: false,
      name: "Tvätta",
      description: "All vit tvätt",
    },
    {
      id: "3",
      difficulty: 1,
      frequency: 2,
      householdId: "1",
      isArchived: true,
      name: "Programmera",
      description: "Gör en hushålls-app",
    },
  ],
  householdtaskHistory: [
    {
      date: Date.now(),
      id: "77",
      profileId: "1",
      taskId: "1,",
    },
  ],
};

export const selectActiveHouseholdTaskHistories = (state: AppState) => {
  const householdId = state.profiles.activeProfile?.householdId;
  const allProfilesInHousehold = state.profiles.profiles.filter(
    (p) => p.householdId === householdId
  );

  let returnHistories: TaskHistory[] = [];

  allProfilesInHousehold.forEach((profile) => {
    let profileHisotries = state.tasks.householdtaskHistory.filter(
      (hh) => hh.profileId === profile.id
    );

    profileHisotries.forEach((profileHistory) => {
      returnHistories.push(profileHistory);
    });
  });

  return returnHistories;
};

export const selectActiveHouseholdTask = (state: AppState) => {
  const returnHouseHTasks = state.tasks.householdTasks?.filter(
    (p) => p.householdId === state.profiles.activeProfile?.householdId
  );
  return returnHouseHTasks;
};

export const getUserTaskHistories = createAsyncThunk<
  TaskHistory[],
  void,
  { rejectValue: string; state: AppState }
>("tasks/getUserTaskHistories", async (_, thunkApi) => {
  try {
    const state = thunkApi.getState();
    const db = getDatabase(app);

    const reference = ref(db, "app/taskHistories");
    const queryResult = query(reference);
    const snapshot = await get(queryResult);

    if (snapshot.exists()) {
      return snapshot.val();
    }

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

export const createHouseholdTaskHistory = createAsyncThunk<
  TaskHistory,
  Task,
  { rejectValue: string; state: AppState }
>("tasks/createHouseholdTaskHistory", async (task, thunkApi) => {
  try {
    //TODO if household is valid
    const state = thunkApi.getState();
    const db = getDatabase(app);
    const reference = ref(db, "app/taskHistories");
    const pushRef = push(reference);

    let newT: TaskHistory = {
      id: pushRef!.key!,
      date: Date.now(),
      profileId: state.profiles.activeProfile!.id,
      taskId: task.id,
    };

    await set(pushRef, newT);

    return newT;
  } catch (error) {
    //TODO look at davids firebase error thingi
    return thunkApi.rejectWithValue("Could not connect to server");
  }
});

export const createHouseholdTask = createAsyncThunk<
  Task,
  Task,
  { rejectValue: string; state: AppState }
>("tasks/createHouseholdTask", async (task, thunkApi) => {
  try {
    //TODO if household is valid
    const state = thunkApi.getState();
    const findHouseHold = state.profiles.activeProfile!.householdId;
    const db = getDatabase(app);
    const reference = ref(db, "app/tasks");
    const pushRef = push(reference);

    let newT: Task = {
      frequency: task.frequency,
      difficulty: task.difficulty,
      householdId: findHouseHold,
      id: pushRef!.key!,
      name: task.name,
      description: task.description,
      isArchived: task.isArchived,
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

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.householdTasks = action.payload;
      let allTasks: Task[] = [];
      for (var key in action.payload) {
        allTasks.push(action.payload[key]);
      }
      state.householdTasks = allTasks;
    });
    builder.addCase(getUserTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    builder.addCase(createHouseholdTask.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createHouseholdTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.householdTasks.push(action.payload);
    });
    builder.addCase(createHouseholdTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    //----- TASK HISTORIES ------
    //GET
    builder.addCase(getUserTaskHistories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserTaskHistories.fulfilled, (state, action) => {
      state.isLoading = false;
      let allTasks: TaskHistory[] = [];
      for (var key in action.payload) {
        allTasks.push(action.payload[key]);
      }
      state.householdtaskHistory = allTasks;
    });
    builder.addCase(getUserTaskHistories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
    //CREATE
    builder.addCase(createHouseholdTaskHistory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createHouseholdTaskHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.householdtaskHistory.push(action.payload);
    });
    builder.addCase(createHouseholdTaskHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const taskReducer = taskSlice.reducer;
