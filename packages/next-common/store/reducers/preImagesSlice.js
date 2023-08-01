import { createSlice } from "@reduxjs/toolkit";

const preImagesSlice = createSlice({
  name: "preImages",
  initialState: {
    trigger: 0,
  },
  reducers: {
    incTrigger(state) {
      state.trigger += 1;
    },
  },
});

export const { incTrigger: incPreImagesTrigger } = preImagesSlice.actions;

export const preImagesTriggerSelector = (state) => state.preImages.trigger;

export default preImagesSlice.reducer;
