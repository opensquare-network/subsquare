import { createSlice } from "@reduxjs/toolkit";

const cmdkSlice = createSlice({
  name: "cmdk",
  initialState: {
    triggerVisible: true,
  },
  reducers: {
    setCmdkTriggerVisible(state, { payload }) {
      state.triggerVisible = payload;
    },
  },
});

export const { setCmdkTriggerVisible } = cmdkSlice.actions;

export const cmdkTriggerVisibleSelector = (state) => state.cmdk.triggerVisible;

export default cmdkSlice.reducer;
