import { createSlice } from "@reduxjs/toolkit";
import { isNil } from "lodash-es";
import orderBy from "lodash.orderby";

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
export const fellowshipCollectiveMembersSelector = (state) => {
  const members = state[name].members;
  if (isNil(members)) {
    return members;
  }

  return orderBy(members, ["rank"], ["desc"]);
};

export default fellowshipCollectiveSlice.reducer;
