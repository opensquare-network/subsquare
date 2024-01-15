import { createSlice } from "@reduxjs/toolkit";

const name = "profileDemocracyDeposits";

const profileDemocracyDepositsSlice = createSlice({
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

export const { setDeposits: setProfileDemocracyDeposits } =
  profileDemocracyDepositsSlice.actions;

export const profileDemocracyDepositsSelector = (state) => state[name].deposits;

export default profileDemocracyDepositsSlice.reducer;
