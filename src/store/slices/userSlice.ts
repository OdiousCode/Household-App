import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { app, auth } from "../../data/firebase/config";

type User = Omit<
  FirebaseUser,
  "toJSON" | "delete" | "reload" | "getIdTokenResult" | "getIdToken"
>;

interface UserState {
  user?: User;
  isLoading: boolean;
  errorMessage: string;
}
const initialState: UserState = {
  isLoading: false,
  errorMessage: "",
};

export const signup = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>("user/signup", async ({ username, password }, thunkApi) => {
  try {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      username,
      password
    );
    return userCredential.user.toJSON() as User;
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

export const signin = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>("user/signin", async ({ username, password }, thunkApi) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
    return userCredential.user.toJSON() as User;
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn(state, action) {
      state.user = action.payload;
    },

    logOut(state) {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state, action) => {
      state.isLoading = true;
      state.errorMessage = "";
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(signup.rejected, (state, action) => {
      // Om det ??r ett firebase fel se till att spara en anv??ndarv??nlig text
      state.errorMessage = action.payload || "";
      state.isLoading = false;
    });

    builder.addCase(signin.pending, (state, action) => {
      state.isLoading = true;
      state.errorMessage = "";
    });
    builder.addCase(signin.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(signin.rejected, (state, action) => {
      // Om det ??r ett firebase fel se till att spara en anv??ndarv??nlig text
      state.errorMessage = action.payload || "";
      state.isLoading = false;
    });
  },
});

export const { logOut, logIn } = userSlice.actions;
export const userReducer = userSlice.reducer;
