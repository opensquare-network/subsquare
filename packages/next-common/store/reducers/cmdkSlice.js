import { createSlice } from "@reduxjs/toolkit";

const cmdkSlice = createSlice({
  name: "cmdk",
  initialState: {
    triggerVisible: true,
    paletteVisible: false,
  },
  reducers: {
    setCmdkTriggerVisible(state, { payload }) {
      state.triggerVisible = payload;
    },
    setCmdkPaletteVisible(state, { payload }) {
      state.paletteVisible = payload;
    },
  },
});

export const { setCmdkTriggerVisible, setCmdkPaletteVisible } =
  cmdkSlice.actions;

export const cmdkTriggerVisibleSelector = (state) => state.cmdk.triggerVisible;
export const cmdkPaletteVisibleSelector = (state) => state.cmdk.paletteVisible;

export default cmdkSlice.reducer;
