import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import {
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import { Household, Profile, ProfileDTO } from "../../data/APItypes";
import { app, auth } from "../../data/firebase/config";
import { AppState, useAppSelector } from "../store";

interface ProfileState {
  isLoading: boolean;
  error: string;

  profiles: Profile[];
  activeProfile?: Profile;
}

const initialState: ProfileState = {
  isLoading: false,
  error: "",

  profiles: [
    {
      avatar: 1,
      householdId: "1",
      id: "1",
      name: "VerkligtNamn",
      email: "verkligEmail",
      pending: false,
      role: "User",
      userId: "123",
    },
    {
      avatar: 2,
      householdId: "1",
      id: "2",
      name: "Också bra namn",
      email: "också bra email",
      pending: false,
      role: "Admin",
      userId: "12345",
    },
  ],
};

// // export const selectActiveProfile
// export const selectCurrentProfile = (state: AppState) => {
//   if (!state.households.activeHouseHold) {
//     return;
//   }
//   const returnUserProfiles = state.profiles.profiles.filter(
//     (p) => p.userId === state.user.user?.uid
//   );

//   const currentProfile = returnUserProfiles.find(
//     (p) => p.householdId === state.households.activeHouseHold?.id
//   );
//   return currentProfile;
// };

//export const selectHouseHoldbyProfileId()

export const selectProfileById = (id: string) => (state: AppState) => {
  const returnUserProfiles = state.profiles.profiles.find((p) => p.id === id);

  return returnUserProfiles;
};

export const selectProfilesByActiveHousehold = (state: AppState) => {
  const returnUserProfiles = state.profiles.profiles.filter(
    (p) => p.householdId === state.profiles.activeProfile?.householdId
  );

  return returnUserProfiles;
};

export const selectValidProfilesByActiveHousehold = (state: AppState) => {
  const returnUserProfiles = state.profiles.profiles.filter(
    (p) => p.householdId === state.profiles.activeProfile?.householdId
  );
  const nonPendingProfiles = returnUserProfiles.filter(
    (p) => p.pending === false
  );
  const validProfiles = nonPendingProfiles.filter((p) => p.avatar !== -1);

  return validProfiles;
};

export const selectPendingProfilesByActiveHousehold = (state: AppState) => {
  const returnUserProfiles = state.profiles.profiles.filter(
    (p) => p.householdId === state.profiles.activeProfile?.householdId
  );
  const pendingProfiles = returnUserProfiles.filter((p) => p.pending === true);

  return pendingProfiles;
};

//TODO
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
  { profile: ProfileDTO; houseHoldId: string },
  { rejectValue: string; state: AppState }
>("profiles/createProfile", async ({ profile, houseHoldId }, thunkApi) => {
  try {
    const state = thunkApi.getState();
    if (!state.user.user) {
      return thunkApi.rejectWithValue(
        "Must be valid Profile + Household combination"
      );
    }
    //profile.id = uid todo.

    const db = getDatabase(app);
    const reference = ref(db, "app/profiles");
    const pushRef = push(reference);

    let returnProfile: Profile = {
      avatar: profile.avatar,
      name: profile.name,
      pending: profile.pending,
      role: profile.role,

      //householdId:
      email: state.user.user.email!,
      userId: state.user.user.uid,
      householdId: houseHoldId,
      id: pushRef!.key!,
    };

    await set(pushRef, returnProfile);

    //TODO look for error?
    return returnProfile;
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

export const deleteProfile = createAsyncThunk<
  Profile,
  { profile: Profile },
  { rejectValue: string; state: AppState }
>("profiles/deleteProfile", async ({ profile }, thunkApi) => {
  try {
    const state = thunkApi.getState();
    if (!state.user.user) {
      return thunkApi.rejectWithValue(
        "Must be valid Profile + Household combination"
      );
    }
    //profile.id = uid todo.

    const db = getDatabase(app);

    await set(ref(db, "app/profiles/" + profile.id), null);

    //TODO look for error?
    return profile;
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

export const updateProfile = createAsyncThunk<
  Profile,
  { profile: Profile },
  { rejectValue: string; state: AppState }
>("profiles/updateProfile", async ({ profile }, thunkApi) => {
  try {
    const state = thunkApi.getState();
    if (!state.user.user) {
      return thunkApi.rejectWithValue(
        "Must be valid Profile + Household combination"
      );
    }
    //profile.id = uid todo.

    const db = getDatabase(app);

    await set(ref(db, "app/profiles/" + profile.id), profile);

    //TODO look for error?
    return profile;
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
  reducers: {
    setActiveProfile(state, action) {
      let specificProfile = state.profiles.find((p) => p.id === action.payload);
      state.activeProfile = specificProfile;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfiles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserProfiles.fulfilled, (state, action) => {
      state.isLoading = false;
      let allProfiles: Profile[] = [];
      for (var key in action.payload) {
        allProfiles.push(action.payload[key]);
      }
      state.profiles = allProfiles;
    });
    builder.addCase(getUserProfiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    builder.addCase(createProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles.push(action.payload);
    });
    builder.addCase(createProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles = state.profiles.map((item, index) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return action.payload;
        }
      });
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    builder.addCase(deleteProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles = state.profiles.map((item, index) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return action.payload;
        }
      });
    });
    builder.addCase(deleteProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const { setActiveProfile } = profileSlice.actions;

export const profileReducer = profileSlice.reducer;
