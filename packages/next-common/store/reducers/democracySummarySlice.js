import { createSlice } from "@reduxjs/toolkit";

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    summary: {},
  },
  reducers: {
    setSummary: (state, { payload }) => {
      state.summary = { ...state.summary, ...payload };
    },
  },
});

export const { setSummary } = summarySlice.actions;

export const summarySelector = (state) => state.summary.summary;

export default summarySlice.reducer;
