import { createSlice } from "@reduxjs/toolkit";

const name = "ambassadorCollective";

const ambassadorCollectiveSlice = createSlice({
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
  setMembers: setAmbassadorCollectiveMembers,
  incTrigger: incAmbassadorCollectiveMembersTrigger,
} = ambassadorCollectiveSlice.actions;

export const ambassadorCollectiveMembersTriggerSelector = (state) =>
  state[name].membersFetchTrigger;
export const ambassadorCollectiveMembersSelector = (state) =>
  state[name].members;

export default ambassadorCollectiveSlice.reducer;
