import { createSlice } from "@reduxjs/toolkit";

const name = "myIdentityDeposits";

const myIdentityDepositsSlice = createSlice({
  name,
  initialState: {
    mainIdentityName: "",
    identityDeposit: null,
    subsDeposit: null,
    subs: null,
  },
  reducers: {
    setIdentityDisplayName(state, { payload }) {
      state.mainIdentityName = payload;
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
  setIdentityDisplayName,
  setIdentityDeposit,
  setSubsDeposits,
  setSubs,
} = myIdentityDepositsSlice.actions;

export const myMainIdentityNameSelector = (state) =>
  state[name].mainIdentityName;
export const myIdentityDepositSelector = (state) => state[name].identityDeposit;
export const myIdentitySubsDepositSelector = (state) => state[name].subsDeposit;
export const myIdentitySubsSelector = (state) => state[name].subs;
export const myIdentitySubsCountSelector = (state) =>
  state[name].subs?.length || 0;

export default myIdentityDepositsSlice.reducer;
