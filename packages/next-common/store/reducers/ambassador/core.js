import { createSlice } from "@reduxjs/toolkit";

const name = "ambassadorCore";

const ambassadorCoreSlice = createSlice({
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
  setMembers: setAmbassadorCoreMembers,
  incTrigger: incAmbassadorCoreMembersTrigger,
} = ambassadorCoreSlice.actions;

export const ambassadorCoreMembersTriggerSelector = (state) =>
  state[name].membersFetchTrigger;
export const ambassadorCoreMembersSelector = (state) => state[name].members;

export default ambassadorCoreSlice.reducer;
