import { createSlice } from "@reduxjs/toolkit";

const tipSlice = createSlice({
  name: "tip",
  initialState: {
    pendingTips: [],
    checkTimes: 0,
  },
  reducers: {
    addPendingTip(state, { payload }) {
      state.pendingTips.push(payload);
    },
    removePendingTip(state, { payload }) {
      state.pendingTips = state.pendingTips.filter(
        (tipHash) => tipHash !== payload
      );
    },
    setCheckTimes(state, { payload }) {
      state.checkTimes = payload;
    },
  },
});

export const pendingTipsSelector = (state) =>
  state.tip.pendingTips;
export const checkTimesSelector = (state) => state.tip.checkTimes;

export const { addPendingTip, removePendingTip, setCheckTimes } =
  tipSlice.actions;

export default tipSlice.reducer;
