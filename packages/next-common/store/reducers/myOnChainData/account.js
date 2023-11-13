import { createSlice } from "@reduxjs/toolkit";

const name = "myDemocracyVoting";

const myAccountSlice = createSlice({
  name,
  initialState: {
    account: null,
  },
  reducers: {
    setAccount(state, { payload }) {
      state.account = payload;
    },
  },
});

export const { setAccount: setMyAccountInfo } = myAccountSlice.actions;

export default myAccountSlice.reducer;
