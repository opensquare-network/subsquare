import { createSlice } from "@reduxjs/toolkit";

const tipSlice = createSlice({
  name: "tip",
  initialState: {
    countDownBlockNum: null,
  },
  reducers: {
    setCountDownBlockNum(state, { payload }) {
      state.countDownBlockNum = payload;
    },
  },
});

export const tipCountDownBlockNumSelector = state => state.tip.countDownBlockNum;

export const { setCountDownBlockNum: setTipCountDownBlockNum } =
  tipSlice.actions;

export default tipSlice.reducer;
