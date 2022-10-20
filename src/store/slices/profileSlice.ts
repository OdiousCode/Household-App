import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { get, getDatabase, push, query, ref, set } from "firebase/database";
import { Household, Profile } from "../../data/APItypes";
import { app } from "../../data/firebase/config";
import { AppState, useAppSelector } from "../store";

interface ProfileState {
  isLoading: boolean;
  error: string;

  profiles: Profile[];
}

const initialState: ProfileState = {
  isLoading: false,
  error: "",

  profiles: [
    {
      avatar: 3,
      householdId: 1,
      id: 1,
      name: "VerkligtNamn",
      pending: false,
      role: "User",
      userId: "123",
    },
  ],
};

// export const selectActiveProfile

//TODO https://redux.js.org/usage/deriving-data-selectors
export const selectUserProfiles = (state: AppState) => {
  const returnUserProfiles = state.profiles.profiles.filter(
    (p) => p.userId === state.user.user?.uid
  );
  return returnUserProfiles;
};

//const selectHouseholdProfiles;

export const getUserProfiles = createAsyncThunk<
  Profile[],
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

export const createProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string; state: AppState }
>("profiles/getUserProfiles", async (profile, thunkApi) => {
  try {
    const state = thunkApi.getState();
    state.user.user?.uid;

    const db = getDatabase(app);

    const reference = ref(db, "app/profiles");
    await set(ref(db, "app/profiles"), profile);

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

// export const setProfiles = createAsyncThunk<Profile, { rejectValue: string }>(
//   "profiles/setProfiles",
//   async (profile, thunkApi) => {
//     try {
//       //const auth = getAuth(app);
//       const profiles: Profile[] = [];

//       return profiles;
//     } catch (error) {
//       console.error(error);
//       if (error instanceof FirebaseError) {
//         return thunkApi.rejectWithValue(error.message);
//       }
//       return thunkApi.rejectWithValue(
//         "Could not signup please contact our support."
//       );
//     }
//   }
// );

// export const setProfiles = createAsyncThunk<
//   Profile[],
//   string,
//   { rejectValue: string }
// >("profile/setProfiles", async (profile, thunkApi) => {
//   return thunkApi.rejectWithValue("Could not save name");
//   return profile;
// });

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserProfiles.pending, (state) => {
      state.isLoading = true;
      console.log("pending");
    });
    builder.addCase(getUserProfiles.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.isLoading = false;
      state.profiles = action.payload;
    });
    builder.addCase(getUserProfiles.rejected, (state, action) => {
      console.log("rejected");
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const profileReducer = profileSlice.reducer;
