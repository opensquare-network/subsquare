import { createSlice } from "@reduxjs/toolkit";

const name = "profileProxyDeposits";

const profileProxyDepositsSlice = createSlice({
  name,
  initialState: {
    deposits: null,
  },
  reducers: {
    setProxyDeposits(state, { payload }) {
      state.deposits = payload;
    },
  },
});

export const { setProxyDeposits: setProfileProxyDeposits } =
  profileProxyDepositsSlice.actions;

export const profileProxyDepositsSelector = (state) => state[name].deposits;

export default profileProxyDepositsSlice.reducer;
