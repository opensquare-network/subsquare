import { createSlice } from "@reduxjs/toolkit";

const name = "ambassadorSalary";

const ambassadorSalarySlice = createSlice({
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

export const { setStatus: setAmbassadorSalaryStatus } =
  ambassadorSalarySlice.actions;

export const ambassadorSalaryStatusSelector = (state) => state[name].status;
export const salaryStatusLoadedSelector = (state) => state[name].loaded;

export default ambassadorSalarySlice.reducer;
