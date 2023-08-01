import { createSlice } from "@reduxjs/toolkit";

const preImagesSlice = createSlice({
  name: "preImages",
  initialState: {
    preImagesTriggerUpdate: [],
  },
  reducers: {
    setPreImagesTriggerUpdate(state, { payload }) {
      state.preImagesTriggerUpdate = payload;
    },
  },
});

export const { setPreImagesTriggerUpdate } = preImagesSlice.actions;

export const preImagesTriggerUpdateSelector = (state) =>
  state.preImages.preImagesTriggerUpdate;

export default preImagesSlice.reducer;
