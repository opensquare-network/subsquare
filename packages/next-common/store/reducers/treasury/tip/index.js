import { createSlice } from "@reduxjs/toolkit";

const name = "tip";

const tipSlice = createSlice({
  name,
  initialState: {
    trigger: 0,
  },
  reducers: {
    incTipTrigger(state) {
      state.trigger += 1;
    },
  },
});

export const { incTipTrigger } = tipSlice.actions;

export const tipTriggerSelector = (state) => state[name].trigger;

export default tipSlice.reducer;
