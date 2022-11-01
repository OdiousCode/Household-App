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
import { getAllAvatars, getAvatar } from "../../constants/Layout";
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

type ChoreStatistic = {
  title: string;
  labels: string[];
  colorScale: string[];
  data: number[];
};

type AllChoreStatistics = {
  total: ChoreStatistic;
  chores: ChoreStatistic[];
};

export type PeriodString =
  | "Current Week"
  | "Previous Week"
  | "Previous Month"
  | "All Time";

export const selectHistoryForPeriod =
  (period: PeriodString) =>
  (state: AppState): AllChoreStatistics => {
    // const av = getAllAvatars();
    // const allHistories = selectActiveHouseholdTaskHistories(state);
    // const allTasks = selectActiveHouseholdTask(state);
    console.log("Period: " + period);
    const allFilteredHistories = selectFilteredHistoryFromPeriodString(
      period,
      state
    );

    let total: ChoreStatistic = {
      title: "Total",
      colorScale: [],
      data: [],
      labels: [],
    };

    let chores: ChoreStatistic[] = [];

    //ALL FILTERED HISTORIES
    // let ProfileHistory = new Map<string, string[]>();

    allFilteredHistories.forEach((history) => {
      const task = state.tasks.householdTasks.find(
        (t) => t.id === history.taskId
      );
      if (!task) {
        console.log("no task");
        return;
      }
      console.log("t: " + task.name + " " + task.difficulty);
      let choreStatistic = chores.find((c) => c.title === task.name);
      console.log("stat: " + choreStatistic);
      if (!choreStatistic) {
        choreStatistic = {
          title: task.name,
          colorScale: [],
          data: [],
          labels: [],
        };

        chores.push(choreStatistic);
      }
      let profile = state.profiles.profiles.find(
        (p) => p.id === history.profileId
      );
      if (!profile) return;
      console.log("prof: " + profile.name);
      let index = choreStatistic.labels.findIndex(
        (l) => l === getAvatar(profile!.avatar).icon
      );
      console.log("index: " + index);
      if ((index = -1)) {
        console.log("Hejhopp");
        choreStatistic.colorScale.push(getAvatar(profile!.avatar).color);
        choreStatistic.data.push(0);
        choreStatistic.labels.push(getAvatar(profile.avatar).icon);
      }
      choreStatistic.data[index] += task.difficulty;
    });
    console.log("c: " + chores[0]?.data + " t: " + total.data);
    return { chores, total };
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

export const updateTask = createAsyncThunk<
  Task,
  { task: Task },
  { rejectValue: string; state: AppState }
>("tasks/updateTask", async ({ task }, thunkApi) => {
  try {
    const state = thunkApi.getState();
    if (!state.user.user) {
      return thunkApi.rejectWithValue(
        "Must be valid Profile + Household combination"
      );
    }

    const db = getDatabase(app);

    await set(ref(db, "app/tasks/" + task.id), task);

    //TODO look for error?
    return task;
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

    builder.addCase(updateTask.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.householdTasks = state.householdTasks.map((item, index) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return action.payload;
        }
      });
    });
    builder.addCase(updateTask.rejected, (state, action) => {
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

function selectFilteredHistoryFromPeriodString(
  period: string,
  state: AppState
) {
  const allHistories = selectActiveHouseholdTaskHistories(state);

  const allOrderdHistories = allHistories.sort((a, b) => b.date - a.date);

  const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const index = allHistories.findIndex((p) => p.date <= aWeekAgo);
  const allFilteredHistories = allOrderdHistories.slice(index);
  console.log(
    "filter: task-id: " +
      allFilteredHistories[0]?.taskId +
      " prof-id " +
      allFilteredHistories[0]?.profileId
  );
  return allFilteredHistories;
}
