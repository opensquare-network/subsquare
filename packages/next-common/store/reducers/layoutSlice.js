const { createSlice } = require("@reduxjs/toolkit");

const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    detail: {
      siderHeight: 0,
    },
  },
  reducers: {
    setLayoutDetailSiderHeight(state, { payload }) {
      state.detail.siderHeight = payload;
    },
  },
});

export const { setLayoutDetailSiderHeight } = layoutSlice.actions;

export const layoutDetailSiderHeight = (state) =>
  state.layout.detail.siderHeight;

export default layoutSlice.reducer;
