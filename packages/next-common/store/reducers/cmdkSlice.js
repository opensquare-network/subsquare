import { createSlice } from "@reduxjs/toolkit";

const cmdkSlice = createSlice({
  name: "cmdk",
  initialState: {
    triggerVisible: true,
    paletteVisible: false,
  },
  reducers: {
    setCmdkPaletteVisible(state, { payload }) {
      state.paletteVisible = payload;
    },
  },
});

export const { setCmdkPaletteVisible } = cmdkSlice.actions;

export const cmdkPaletteVisibleSelector = (state) => state.cmdk.paletteVisible;

export default cmdkSlice.reducer;
