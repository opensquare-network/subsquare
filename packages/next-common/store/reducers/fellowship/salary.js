import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipSalary";

const fellowshipSalarySlice = createSlice({
  name,
  initialState: {
    status: null,
  },
  reducers: {
    setStatus(state, { payload }) {
      state.status = payload;
    },
  },
});

export const { setStatus: setFellowshipSalaryStatus } =
  fellowshipSalarySlice.actions;

export const fellowshipSalaryStatusSelector = (state) => state[name].status;

export default fellowshipSalarySlice.reducer;
