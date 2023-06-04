import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipMaxVoters";

const fellowshipMaxVotersSlice = createSlice({
  name,
  initialState: {
    maxVoters: null,
  },
  reducers: {
    setFellowshipMaxVoters(state, { payload }) {
      state.maxVoters = payload;
    },
    clearFellowshipMaxVoters(state) {
      state.maxVoters = null;
    },
  },
});

export const { setFellowshipMaxVoters, clearFellowshipMaxVoters } = fellowshipMaxVotersSlice.actions;

export const maxVotersSelector = state => state[name].maxVoters;

export default fellowshipMaxVotersSlice.reducer;
