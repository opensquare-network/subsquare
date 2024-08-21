import { createSlice } from "@reduxjs/toolkit";

const name = "fellowshipCore";

const fellowshipCoreSlice = createSlice({
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
  setMembers: setFellowshipCoreMembers,
  incTrigger: incFellowshipCoreMembersTrigger,
} = fellowshipCoreSlice.actions;

export const fellowshipCoreMembersTriggerSelector = (state) =>
  state[name].membersFetchTrigger;

export default fellowshipCoreSlice.reducer;
