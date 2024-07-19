import { createSlice } from "@reduxjs/toolkit";

const userPromptsSlice = createSlice({
  name: "userPrompts",
  initialState: {
    fellowshipDemotionExpired: false,
    fellowshipPromotable: false,
    ambassadorDemotionExpired: false,
    ambassadorPromotable: false,
  },
  reducers: {
    setFellowshipDemotionExpired: (state, { payload }) => {
      state.fellowshipDemotionExpired = payload;
    },
    setFellowshipPromotable: (state, { payload }) => {
      state.fellowshipPromotable = payload;
    },
    setAmbassadorDemotionExpired: (state, { payload }) => {
      state.ambassadorDemotionExpired = payload;
    },
    setAmbassadorPromotable: (state, { payload }) => {
      state.ambassadorPromotable = payload;
    },
  },
});

export const fellowshipDemotionExpiredSelector = (state) =>
  state.userPrompts?.fellowshipDemotionExpired;
export const fellowshipPromotableSelector = (state) =>
  state.userPrompts?.fellowshipPromotable;
export const ambassadorDemotionExpiredSelector = (state) =>
  state.userPrompts?.ambassadorDemotionExpired;
export const ambassadorPromotableSelector = (state) =>
  state.userPrompts?.ambassadorPromotable;

export const {
  setFellowshipDemotionExpired,
  setFellowshipPromotable,
  setAmbassadorDemotionExpired,
  setAmbassadorPromotable,
} = userPromptsSlice.actions;

export default userPromptsSlice.reducer;
