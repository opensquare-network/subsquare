import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipCollective";

const fellowshipCollectiveSlice = createSlice({
  name,
  initialState: {
    members: null,
    membersFetchTrigger: 0,
  },
  reducers: {
    setMembers(state, { payload }) {
      state.members = payload;
    },
    incTrigger(state) {
      state.membersFetchTrigger += 1;
    },
  },
});

export const {
  setMembers: setFellowshipCollectiveMembers,
  incTrigger: incFellowshipCollectiveMembersTrigger,
} = fellowshipCollectiveSlice.actions;

export const fellowshipCollectiveMembersTriggerSelector = (state) =>
  state[name].membersFetchTrigger;
export const fellowshipCollectiveMembersSelector = (state) =>
  state[name].members;

export default fellowshipCollectiveSlice.reducer;
