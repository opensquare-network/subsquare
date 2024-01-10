import { createSlice } from "@reduxjs/toolkit";

const name = "profilePreimageDeposits";

const profilePreimageDepositsSlice = createSlice({
  name,
  initialState: {
    preimageStatuses: null,
  },
  reducers: {
    setPreimageStatuses(state, { payload }) {
      state.preimageStatuses = payload;
    },
  },
});

export const { setPreimageStatuses: setProfilePreimageStatuses } =
  profilePreimageDepositsSlice.actions;

export const profilePreimageDepositsSelector = (state) =>
  state[name].preimageStatuses;

export default profilePreimageDepositsSlice.reducer;
