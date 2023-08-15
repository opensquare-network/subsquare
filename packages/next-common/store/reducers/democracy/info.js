import { createSlice } from "@reduxjs/toolkit";

export const name = "democracyInfo";

const democracyInfoSlice = createSlice({
  name,
  initialState: {
    period: null,
  },
  reducers: {
    setPeriod(state, { payload }) {
      state.period = payload;
    },
  },
});

export const { setPeriod: setDemocracyLockingPeriod } =
  democracyInfoSlice.actions;

export const democracyLockingPeriodSelector = (state) => state[name].period;

export default democracyInfoSlice.reducer;
