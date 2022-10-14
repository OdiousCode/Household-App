import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  //TODO alter
  balance: number;
  transactions: number[];
}

const initialState: UserState = {
  balance: 0,
  transactions: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    deposit(state, action: PayloadAction<number>) {
      state.balance += action.payload;
      state.transactions.push(action.payload);
    },
    withdrawal(state, action: PayloadAction<number>) {
      state.balance -= action.payload;
      state.transactions.push(-action.payload);
    },
  },
});

export const { deposit, withdrawal } = userSlice.actions;
export const userReducer = userSlice.reducer;
