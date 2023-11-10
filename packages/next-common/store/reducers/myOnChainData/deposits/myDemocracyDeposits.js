import { createSlice } from "@reduxjs/toolkit";

const name = "myDemocracyDeposits";

const myDemocracyDepositsSlice = createSlice({
  name,
  initialState: {
    deposits: null,
  },
  reducers: {
    setDeposits(state, { payload }) {
      state.deposits = payload;
    },
  },
});

export const { setDeposits: setDemocracyDeposits } =
  myDemocracyDepositsSlice.actions;

export default myDemocracyDepositsSlice.reducer;
