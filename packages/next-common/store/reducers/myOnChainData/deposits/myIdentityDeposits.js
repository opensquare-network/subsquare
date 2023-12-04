import { createSlice } from "@reduxjs/toolkit";

const name = "myIdentityDeposits";

const myIdentityDepositsSlice = createSlice({
  name,
  initialState: {
    identityDeposit: null,
    subsDeposit: null,
    subsCount: 0,
  },
  reducers: {
    setIdentityDeposit(state, { payload }) {
      state.identityDeposit = payload;
    },
    setSubsDeposits(state, { payload }) {
      state.subsDeposit = payload;
    },
    setSubsCount(state, { payload }) {
      state.subsCount = payload;
    },
  },
});

export const { setIdentityDeposit, setSubsDeposits, setSubsCount } =
  myIdentityDepositsSlice.actions;

export const myIdentityDepositSelector = (state) => state[name].identityDeposit;
export const myIdentitySubsDepositSelector = (state) => state[name].subsDeposit;
export const myIdentitySubsCountSelector = (state) => state[name].subsCount;

export default myIdentityDepositsSlice.reducer;
