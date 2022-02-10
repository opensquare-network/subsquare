import { createSlice } from "@reduxjs/toolkit";

const democracySummarySlice = createSlice({
  name: "democracySummary",
  initialState: {
    summary: {},
  },
  reducers: {
    setSummary: (state, { payload }) => {
      state.summary = { ...state.summary, ...payload };
    },
  },
});

export const { setSummary } = democracySummarySlice.actions;

export const summarySelector = (state) => state.democracySummary.summary;

export default democracySummarySlice.reducer;
