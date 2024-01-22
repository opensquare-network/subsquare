import { createSlice } from "@reduxjs/toolkit";

const name = "myIdentityDeposits";

const myIdentityDepositsSlice = createSlice({
  name,
  initialState: {
    mainIdentityName: "",
    address: null,
    identityDeposit: null,
    subsDeposit: null,
    subs: null,
  },
  reducers: {
    setIdentityAddress(state, { payload }) {
      state.address = payload;
    },
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
  setIdentityAddress,
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

export default myIdentityDepositsSlice.reducer;
