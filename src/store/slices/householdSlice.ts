import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { get, getDatabase, push, query, ref, set } from "firebase/database";

import { Household } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState } from "../store";

interface HouseHoldState {
  isLoading: boolean;
  error: string;

  households: Household[];
}

const initialState: HouseHoldState = {
  isLoading: false,
  error: "",

  households: [
    {
      entrenceCode: "a2e3",
      id: "1",
      name: "Fam 4",
    },
  ],
};

export const selectActiveHousehold = (state: AppState) => {
  const activeHousehold = state.households.households.find(
    (h) => h.id === state.profiles.activeProfile?.householdId
  );
  return activeHousehold;
};

export const createHousehold = createAsyncThunk<
  Household,
  string,
  { rejectValue: string }
>("household/createHousehold", async (name, thunkApi) => {
  try {
    const db = getDatabase(app);
    const reference = ref(db, "app/households");
    const pushRef = push(reference);

    let newH: Household = {
      entrenceCode: pushRef.key!.substring(14, 20),
      id: pushRef.key!.substring(14, 20),
      name: name,
    };

    await set(pushRef, newH);

    return newH;
  } catch (error) {
    return thunkApi.rejectWithValue("Could not connect to server");
  }
});

export const updateHousehold = createAsyncThunk<
  Household,
  { household: Household },
  { rejectValue: string; state: AppState }
>("household/updateHousehold", async ({ household }, thunkApi) => {
  try {
    const state = thunkApi.getState();
    if (!state.user.user) {
      return thunkApi.rejectWithValue(
        "Must be valid Profile + Household combination"
      );
    }

    const db = getDatabase(app);

    await set(ref(db, "app/households/" + household.id), household);

    return household;
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

export const getUserHouseholds = createAsyncThunk<
  Household[],
  void,
  { rejectValue: string; state: AppState }
>("households/getUserHouseholds", async (_, thunkApi) => {
  try {
    const state = thunkApi.getState();
    state.user.user?.uid;

    const db = getDatabase(app);

    const reference = ref(db, "app/households");
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

const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GET USER HOUSEHOLDS
    builder.addCase(getUserHouseholds.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserHouseholds.fulfilled, (state, action) => {
      state.isLoading = false;
      let allHouseholds: Household[] = [];
      for (var key in action.payload) {
        allHouseholds.push(action.payload[key]);
      }
      state.households = allHouseholds;
    });
    builder.addCase(getUserHouseholds.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    //CREATE HOUSEHOLD
    builder.addCase(createHousehold.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(createHousehold.fulfilled, (state, action) => {
      state.households.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(createHousehold.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    builder.addCase(updateHousehold.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateHousehold.fulfilled, (state, action) => {
      state.isLoading = false;
      state.households = state.households.map((item, index) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return action.payload;
        }
      });
    });
    builder.addCase(updateHousehold.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const selectUser = (state: any) => state.user.user;

export const householdReducer = householdSlice.reducer;
