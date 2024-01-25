import { createSlice } from "@reduxjs/toolkit";
import orderBy from "lodash.orderby";
import isNil from "lodash.isnil";

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
export const fellowshipCoreMembersSelector = (state) => {
  const members = state[name].members;
  if (isNil(members)) {
    return members;
  }

  return orderBy(members, ["rank"], ["desc"]);
};

export default fellowshipCoreSlice.reducer;
