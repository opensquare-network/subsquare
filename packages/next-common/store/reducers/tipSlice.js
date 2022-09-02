import { createSlice } from "@reduxjs/toolkit";

const tipSlice = createSlice({
  name: "tip",
  initialState: {
    pendingTips: [],
    checkTimes: 0,
    countDownBlockNum: null,
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
    setCountDownBlockNum(state, { payload }) {
      state.countDownBlockNum = payload;
    }
  },
});

export const pendingTipsSelector = (state) =>
  state.tip.pendingTips;
export const checkTimesSelector = (state) => state.tip.checkTimes;
export const tipCountDownBlockNumSelector = state => state.tip.countDownBlockNum;

export const { addPendingTip, removePendingTip, setCheckTimes, setCountDownBlockNum: setTipCountDownBlockNum } =
  tipSlice.actions;

export default tipSlice.reducer;
