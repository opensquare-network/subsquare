import { createSlice } from "@reduxjs/toolkit";

const name = "profileTransfers";

const profileTransfersSlice = createSlice({
  name,
  initialState: {
    transfers: null,
  },
  reducers: {
    setTransfers(state, { payload }) {
      state.transfers = payload;
    },
  },
});

export const { setTransfers: setProfileTransfers } =
  profileTransfersSlice.actions;

export const profileTransfersSelector = (state) => state[name].transfers;

export default profileTransfersSlice.reducer;
