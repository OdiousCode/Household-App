import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*interface UserState {
  //TODO alter
  balance: number;
  transactions: number[];
}

const initialState: UserState = {
  balance: 0,
  transactions: [],
};*/

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    logIn(state, action) {
      state.user = action.payload;
    },
    logOut(state) {
      state.user = null
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export const selectUser = (state: any) => state.user.user;
export default userSlice.reducer;
