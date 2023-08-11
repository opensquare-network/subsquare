import { createSlice } from "@reduxjs/toolkit";

const name = "referendaMeta";

const referendaMetaSlice = createSlice({
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

export const { setPeriod: setReferendaLockingPeriod } =
  referendaMetaSlice.actions;

export const referendaLockingPeriodSelector = (state) => state[name].period;

export default referendaMetaSlice.reducer;
