import { createSlice } from "@reduxjs/toolkit";

const name = "myPreimageDeposits";

const myPreimageDepositsSlice = createSlice({
  name,
  initialState: {
    myPreimageStatuses: null,
  },
  reducers: {
    setMyPreimageStatuses(state, { payload }) {
      state.myPreimageStatuses = payload;
    },
  },
});

export const { setMyPreimageStatuses } = myPreimageDepositsSlice.actions;

export const myPreimageDepositsSelector = (state) =>
  state[name].myPreimageStatuses;

export default myPreimageDepositsSlice.reducer;
