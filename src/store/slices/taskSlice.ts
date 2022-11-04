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
import { date, number } from "yup";
import {
  getAllAvatars,
  getAvatar,
  getColorByAvatar,
} from "../../constants/Layout";
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
      if (!task) return;

      let choreStatistic = chores.find((c) => c.title === task.name);
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

      let index = choreStatistic.labels.findIndex(
        (l) => l === getAvatar(profile!.avatar).icon
      );

      if (index == -1) {
        choreStatistic.colorScale.push(getAvatar(profile!.avatar).color);
        choreStatistic.data.push(0);
        choreStatistic.labels.push(getAvatar(profile.avatar).icon);

        index = choreStatistic.labels.findIndex(
          (l) => l === getAvatar(profile!.avatar).icon
        );
      }

      let numb: number = +choreStatistic.data[index];
      numb += +task.difficulty;
      choreStatistic.data[index] = +numb;
    });

    chores.forEach((chore) => {
      chore.labels.forEach((label) => {
        let index = total.labels.findIndex((l) => l === label);

        if (index == -1) {
          let color = getColorByAvatar(label);

          total.labels.push(label);
          total.data.push(0);
          total.colorScale.push(color);
        }
        let totalIndex = total.labels.findIndex((l) => l === label);
        let choreIndex = chore.labels.findIndex((l) => l === label);

        let storedNumb: number = total.data[totalIndex];
        let additionNumb = chore.data[choreIndex];
        let totalNumb = storedNumb + additionNumb;

        total.data[totalIndex] = totalNumb;
      });
    });

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

export const deleteTask = createAsyncThunk<
  Task,
  { task: Task },
  { rejectValue: string; state: AppState }
>("tasks/deleteTask", async ({ task }, thunkApi) => {
  try {
    const state = thunkApi.getState();
    if (!state.user.user) {
      return thunkApi.rejectWithValue(
        "Must be valid Profile + Household combination"
      );
    }
    //profile.id = uid todo.

    const db = getDatabase(app);

    await set(ref(db, "app/tasks/" + task.id), null);

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

    builder.addCase(deleteTask.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.householdTasks = state.householdTasks.map((item, index) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return action.payload;
        }
      });
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
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
  period: PeriodString,
  state: AppState
) {
  const allHistories = selectActiveHouseholdTaskHistories(state);
  // oldest first
  const allOrderdHistories = allHistories.sort((a, b) => b.date - a.date);

  if (period !== "All Time") {
    let daysToCutEnd = 0;
    let daysToCutStart: number = -1;
    switch (period) {
      case "Current Week": {
        daysToCutEnd = 7;
        break;
      }
      case "Previous Month": {
        // realy wierd way of doing it but idc
        daysToCutEnd = 60;
        daysToCutStart = 30;
        break;
      }
      case "Previous Week": {
        daysToCutEnd = 14;
        daysToCutStart = 7;

        break;
      }
    }

    let timeStamp = Date.now() - daysToCutEnd * 24 * 60 * 60 * 1000;
    let index = allHistories.findIndex((p) => p.date <= timeStamp);

    let allFilteredHistories = allOrderdHistories;
    if (index !== -1) {
      allFilteredHistories = allOrderdHistories.slice(0, index);
    }

    // techniclly dont need the if statement, but prob slightly better optimized.
    if (daysToCutStart !== -1) {
      timeStamp = Date.now() - daysToCutStart * 24 * 60 * 60 * 1000;
      index = allFilteredHistories.findIndex((p) => p.date <= timeStamp);

      if (index !== -1) {
        allFilteredHistories = allFilteredHistories.slice(index, undefined);
      } else {
        // if no found = nothing older then X, therefore there cant possbile be anything inbeetween.
        allFilteredHistories = [];
      }
    }

    return allFilteredHistories;
  }

  return allOrderdHistories;
}
