import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { equalTo, get, getDatabase, onValue, orderByChild, push, query, ref, set } from "firebase/database";
import { Profile } from "../../data/APItypes";
import { app, auth } from "../../data/firebase/config";
import { Household } from "../../data/APItypes";

const db = getDatabase(app);

export interface HouseholdState {
    household?: Household;
    isLoading: boolean;
    error: string;
  }

const initialState: HouseholdState= {
    household: undefined,
    isLoading: false,
    error: "",
};

export const createHousehold = createAsyncThunk<
  Household,
  Household,
  { rejectValue: string }
>("household/createHousehold", async (household, thunkApi) => {
  try {
    const db = getDatabase(app)
        await set(ref(db, "app/households"), household)
        alert('Household created!')
    return household;
  } catch (error) {
    return thunkApi.rejectWithValue(
      "Could not signup please contact our support."
    );
  }
});


export const getHouseholdByEntrenceCode = createAsyncThunk<
  Household,
  string,
  { rejectValue: string; }
>("app/household/getHouseholdByEntrenceCode", async (entrenceCode, thunkApi) => {
  try {
    const db = getDatabase(app);
    const householdRef = ref(db, 'app/households');
    const householdQuery = query(householdRef, orderByChild('entrenceCode'), equalTo(entrenceCode));

    const snapshot = await get(householdQuery)
    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
    }

  } catch (error) {
    return thunkApi.rejectWithValue("something went wrong");
  }
})
      
const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createHousehold.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createHousehold.fulfilled, (state, action) => {
      state.household = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createHousehold.rejected, (state) => {
      // Om det är ett firebase fel se till att spara en användarvänlig text
      state.error = "Could not create household";
      state.isLoading = false;
    });

    builder.addCase(getHouseholdByEntrenceCode.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(getHouseholdByEntrenceCode.fulfilled, (state, action) => {
      state.household = action.payload;
      state.isLoading = false;
    });

  },
});

export const selectUser = (state: any) => state.user.user;

export const householdReducer = householdSlice.reducer;
