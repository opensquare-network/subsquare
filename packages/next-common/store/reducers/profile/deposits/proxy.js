import { createSlice } from "@reduxjs/toolkit";

const name = "profileProxyDeposits";

const initialState = {
  deposits: {
    items: [],
    total: 0,
    balance: 0,
    loading: false,
  },
};

const profileProxyDepositsSlice = createSlice({
  name,
  initialState: {
    ...initialState,
  },
  reducers: {
    resetProxyDeposits(state) {
      state.deposits = initialState.deposits;
    },
    setProxyDeposits(state, { payload }) {
      state.deposits = payload;
    },
    setLoading(state, { payload }) {
      state.deposits.loading = payload;
    },
  },
});

export const {
  setProxyDeposits: setProfileProxyDeposits,
  setLoading: setProfileProxyDepositsLoading,
  resetProxyDeposits: resetProfileProxyDeposits,
} = profileProxyDepositsSlice.actions;

export const profileProxyDepositsSelector = (state) => state[name].deposits;

export default profileProxyDepositsSlice.reducer;
