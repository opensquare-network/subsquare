import { createSlice } from "@reduxjs/toolkit";
import { hasPreimagesGraphQL } from "next-common/utils/env/preimage";

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

export const { incTrigger } = preImagesSlice.actions;

export const preImagesTriggerSelector = (state) => state.preImages.trigger;

export default preImagesSlice.reducer;

export const incPreImagesTrigger = () => (dispatch) => {
  if (!hasPreimagesGraphQL()) {
    dispatch(incTrigger());
    return;
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(
      () => {
        dispatch(incTrigger());
      },
      5000 + i * i * 1000,
    );
  }
};
