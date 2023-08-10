import { createSlice } from "@reduxjs/toolkit";

const name = "myReferendaVoting";

const myReferendaVotingSlice = createSlice({
  name,
  initialState: {
    voting: [],
    classLocks: [],
  },
  reducers: {
    setVoting(state, { payload }) {
      state.voting = payload;
    },
    setClassLocks(state, { payload }) {
      state.classLocks = payload;
    },
  },
});

export const {
  setVoting: setMyReferendaVoting,
  setClassLocks: setMyReferendaClassLocks,
} = myReferendaVotingSlice.actions;

export const myReferendaVotingSelector = (state) => state[name].voting;

export default myReferendaVotingSlice.reducer;
