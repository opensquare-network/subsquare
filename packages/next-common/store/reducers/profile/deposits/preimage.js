import { createSlice } from "@reduxjs/toolkit";

const name = "profilePreimageDeposits";

const profilePreimageDepositsSlice = createSlice({
  name,
  initialState: {
    deposits: null,
  },
  reducers: {
    setPreimageDeposits(state, { payload }) {
      state.deposits = payload;
    },
  },
});

export const { setPreimageDeposits: setProfilePreimageDeposits } =
  profilePreimageDepositsSlice.actions;

export const profilePreimageDepositsSelector = (state) => state[name].deposits;

export default profilePreimageDepositsSlice.reducer;
