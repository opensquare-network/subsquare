import { createSlice } from "@reduxjs/toolkit";

const userPromptsSlice = createSlice({
  name: "userPrompts",
  initialState: {
    fellowshipPromotable: false,
    fellowshipDemotionExpired: false,
    fellowshipDemotionExpireRemind: false,
    fellowshipOffboardExpired: false,
    fellowshipOffboardExpireRemind: false,
    ambassadorPromotable: false,
    ambassadorDemotionExpired: false,
    ambassadorDemotionExpireRemind: false,
    ambassadorOffboardExpired: false,
    ambassadorOffboardExpireRemind: false,
  },
  reducers: {
    setFellowshipDemotionExpired: (state, { payload }) => {
      state.fellowshipDemotionExpired = payload;
    },
    setFellowshipPromotable: (state, { payload }) => {
      state.fellowshipPromotable = payload;
    },
    setFellowshipDemotionExpireRemind(state, { payload }) {
      state.fellowshipDemotionExpireRemind = payload;
    },
    setFellowshipOffboardExpired: (state, { payload }) => {
      state.fellowshipOffboardExpired = payload;
    },
    setFellowshipOffboardExpireRemind(state, { payload }) {
      state.fellowshipOffboardExpireRemind = payload;
    },
    setAmbassadorDemotionExpired: (state, { payload }) => {
      state.ambassadorDemotionExpired = payload;
    },
    setAmbassadorPromotable: (state, { payload }) => {
      state.ambassadorPromotable = payload;
    },
    setAmbassadorDemotionExpireRemind(state, { payload }) {
      state.ambassadorDemotionExpireRemind = payload;
    },
    setAmbassadorOffboardExpired: (state, { payload }) => {
      state.ambassadorOffboardExpired = payload;
    },
    setAmbassadorOffboardExpireRemind(state, { payload }) {
      state.ambassadorOffboardExpireRemind = payload;
    },
  },
});

export const fellowshipDemotionExpiredSelector = (state) =>
  state.userPrompts?.fellowshipDemotionExpired;
export const fellowshipPromotableSelector = (state) =>
  state.userPrompts?.fellowshipPromotable;
export const fellowshipDemotionExpireRemindSelector = (state) =>
  state.userPrompts?.fellowshipDemotionExpireRemind;
export const fellowshipOffboardExpiredSelector = (state) =>
  state.userPrompts?.fellowshipOffboardExpired;
export const fellowshipOffboardExpireRemindSelector = (state) =>
  state.userPrompts?.fellowshipOffboardExpireRemind;
export const ambassadorDemotionExpiredSelector = (state) =>
  state.userPrompts?.ambassadorDemotionExpired;
export const ambassadorPromotableSelector = (state) =>
  state.userPrompts?.ambassadorPromotable;
export const ambassadorDemotionExpireRemindSelector = (state) =>
  state.userPrompts?.ambassadorDemotionExpireRemind;
export const ambassadorOffboardExpiredSelector = (state) =>
  state.userPrompts?.ambassadorOffboardExpired;
export const ambassadorOffboardExpireRemindSelector = (state) =>
  state.userPrompts?.ambassadorOffboardExpireRemind;

export const {
  setFellowshipDemotionExpired,
  setFellowshipPromotable,
  setFellowshipDemotionExpireRemind,
  setFellowshipOffboardExpired,
  setFellowshipOffboardExpireRemind,
  setAmbassadorDemotionExpired,
  setAmbassadorPromotable,
  setAmbassadorDemotionExpireRemind,
  setAmbassadorOffboardExpired,
  setAmbassadorOffboardExpireRemind,
} = userPromptsSlice.actions;

export default userPromptsSlice.reducer;
