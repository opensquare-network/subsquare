import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    detail: {
      sidebarHeight: 0,
    },
  },
  reducers: {
    setLayoutDetailSidebarHeight(state, { payload }) {
      state.detail.sidebarHeight = payload;
    },
  },
});

export const { setLayoutDetailSidebarHeight } = layoutSlice.actions;

export const layoutDetailSidebarHeight = (state) =>
  state.layout.detail.sidebarHeight;

export default layoutSlice.reducer;
