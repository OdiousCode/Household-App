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
import { Household, Profile } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState, useAppSelector } from "../store";

interface HouseHoldState {
  isLoading: boolean;
  error: string;

  households: Household[];
  activeHouseHold?: Household;
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
  activeHouseHold: undefined,
};
// Skapa ett hushåll i databasen
// Skapa en profil, med Id === Uid
// Profil.pending = false
export const createHousehold = createAsyncThunk<
  Household,
  { household: Household },
  { rejectValue: string }
>("household/createHousehold", async ({ household }, thunkApi) => {
  try {
    const db = getDatabase(app);
    await set(ref(db, "app/households"), household);

    return household;
  } catch (error) {
    //TODO look at davids firebase error thingi
    return thunkApi.rejectWithValue("Could not connect to server");
  }
});

// UpdateProfile
// Avatar == avatar
// name = name
// updateDb

// Entrencode
// Hämta household med entrencode === entrencode
// skapa en profil där allt = empty förutom, Id === uid och pending === true, householdid === household
//export const enterHouseHold

// export const createProfile = createAsyncThunk<
//   Household,
//   string,
//   { rejectValue: string; state: AppState }
// >("app/household/selectHouseHold", async (entrenceCode, thunkApi) => {
//   try {
//     const db = getDatabase(app);
//     const householdRef = ref(db, "app/households");
//     const householdQuery = query(
//       householdRef,
//       orderByChild("entrenceCode"),
//       equalTo(entrenceCode)
//     );

//     const snapshot = await get(householdQuery);
//     if (snapshot.exists()) {
//       console.log(snapshot.val());
//       return snapshot.val();
//     } else {
//       console.log("No data available");
//     }
//     throw "No Household was found";
//   } catch (error) {
//     return thunkApi.rejectWithValue("something went wrong");
//   }
// });

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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserHouseholds.pending, (state) => {
      state.isLoading = true;
      console.log("pending");
    });
    builder.addCase(getUserHouseholds.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.isLoading = false;
      state.households = action.payload;
    });
    builder.addCase(getUserHouseholds.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    builder.addCase(createHousehold.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(createHousehold.fulfilled, (state, action) => {
      state.households.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(createHousehold.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const householdReducer = profileSlice.reducer;
