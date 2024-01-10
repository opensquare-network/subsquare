import { createSlice } from "@reduxjs/toolkit";

const name = "myPreimageDeposits";

const myPreimageDepositsSlice = createSlice({
  name,
  initialState: {
    deposits: null,
  },
  reducers: {
    setMyPreimageDeposits(state, { payload }) {
      state.deposits = payload;
    },
  },
});

export const { setMyPreimageDeposits } = myPreimageDepositsSlice.actions;

export const myPreimageDepositsSelector = (state) => state[name].deposits;

export default myPreimageDepositsSlice.reducer;
