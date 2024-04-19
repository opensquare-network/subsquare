import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipSalary";

const fellowshipSalarySlice = createSlice({
  name,
  initialState: {
    status: null,
    loaded: false,
  },
  reducers: {
    setStatus(state, { payload }) {
      state.status = payload;
      state.loaded = true;
    },
  },
});

export const { setStatus: setFellowshipSalaryStatus } =
  fellowshipSalarySlice.actions;

export const fellowshipSalaryStatusSelector = (state) => state[name].status;
export const salaryStatusLoadedSelector = (state) => state[name].loaded;

export default fellowshipSalarySlice.reducer;
