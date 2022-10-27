import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  orderByValue,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import { where } from "firebase/firestore";
import thunk from "redux-thunk";
import { Household, Profile } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState, useAppDispatch, useAppSelector } from "../store";

interface HouseHoldState {
  isLoading: boolean;
  error: string;

  households: Household[];
  //activeHouseHold?: Household;
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
  console.log("q " + activeHousehold);
  return activeHousehold;
};

export const createHousehold = createAsyncThunk<
  Household,
  string,
  { rejectValue: string }
>("household/createHousehold", async (name, thunkApi) => {
  try {
    //TODO if household is valid
    const db = getDatabase(app);
    const reference = ref(db, "app/households");
    const pushRef = push(reference);

    let newH: Household = {
      entrenceCode: pushRef.key!,
      id: pushRef.key!,
      name: name,
    };

    await set(pushRef, newH);

    return newH;
  } catch (error) {
    //TODO look at davids firebase error thingi
    return thunkApi.rejectWithValue("Could not connect to server");
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

const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {
    // setActiveHouseHold(state, action) {
    //   let specificHousehold = state.households.find(
    //     (p) => p.id === action.payload
    //   );
    //   state.activeHouseHold = specificHousehold;
    // },
  },
  extraReducers: (builder) => {
    // GET USER HOUSEHOLDS
    builder.addCase(getUserHouseholds.pending, (state) => {
      state.isLoading = true;
      console.log("pending");
    });
    builder.addCase(getUserHouseholds.fulfilled, (state, action) => {
      console.log("fulfilled");
      console.log("get user households");
      state.isLoading = false;
      let allHouseholds: Household[] = [];
      for (var key in action.payload) {
        allHouseholds.push(action.payload[key]);
      }
      state.households = allHouseholds;
    });
    builder.addCase(getUserHouseholds.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    //CREATE HOUSEHOLD
    builder.addCase(createHousehold.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(createHousehold.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.households.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(createHousehold.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    // //CREATE SetActiveHousehold
    // builder.addCase(setActiveHousehold.pending, (state, action) => {
    //   state.isLoading = true;
    //   state.error = "";
    // });
    // builder.addCase(setActiveHousehold.fulfilled, (state, action) => {
    //   console.log("fulfilled");
    //   console.log("payload household");
    //   console.log(action.payload);
    //   state.activeHouseHold = action.payload;
    //   state.isLoading = false;
    // });
    // builder.addCase(setActiveHousehold.rejected, (state, action) => {
    //   console.log("setActiveHousehold");
    //   console.log(state.activeHouseHold);
    //   console.log("rejected " + action.payload);
    //   state.isLoading = false;
    //   state.error = action.payload || "Unknown error";
    // });
  },
});

//export const { setActiveHouseHold } = householdSlice.actions;
export const selectUser = (state: any) => state.user.user;

export const householdReducer = householdSlice.reducer;
