import { createSlice } from "@reduxjs/toolkit";

const name = "profileIdentityDeposits";

const profileIdentityDepositsSlice = createSlice({
  name,
  initialState: {
    mainIdentityName: "",
    address: null,
    identityDeposit: null,
    subsDeposit: null,
    subs: null,
  },
  reducers: {
    setIdentityDisplayName(state, { payload }) {
      state.mainIdentityName = payload;
    },
    setIdentityAddress(state, { payload }) {
      state.address = payload;
    },
    setIdentityDeposit(state, { payload }) {
      state.identityDeposit = payload;
    },
    setSubsDeposits(state, { payload }) {
      state.subsDeposit = payload;
    },
    setSubs(state, { payload }) {
      state.subs = payload;
    },
  },
});

export const {
  setIdentityAddress: setProfileIdentityAddress,
  setIdentityDisplayName: setProfileIdentityDisplayName,
  setIdentityDeposit: setProfileIdentityDeposit,
  setSubsDeposits: setProfileSubsDeposits,
  setSubs: setProfileSubs,
} = profileIdentityDepositsSlice.actions;

export const profileMainIdentityNameSelector = (state) =>
  state[name].mainIdentityName;
export const profileIdentityDepositSelector = (state) =>
  state[name].identityDeposit;
export const profileIdentitySubsDepositSelector = (state) =>
  state[name].subsDeposit;
export const profileIdentitySubsSelector = (state) => state[name].subs;

export default profileIdentityDepositsSlice.reducer;
