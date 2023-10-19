import { createSlice } from "@reduxjs/toolkit";

const name = "myReferendaDelegations";

const myReferendaDelegationSlice = createSlice({
  name,
  initialState: {
    delegations: [],
    trigger: 0,
  },
  reducers: {
    setDelegations(state, { payload }) {
      state.delegations = payload;
    },
    incTrigger(state) {
      state.trigger += 1;
    },
  },
});

export const {
  setDelegations: setMyReferendaDelegations,
  incTrigger: incMyReferendaDelegationsTrigger,
} = myReferendaDelegationSlice.actions;

export const myReferendaDelegationsSelector = (state) =>
  state[name].delegations;
export const myReferendaDelegationsTrigger = (state) => state[name].trigger;

export default myReferendaDelegationSlice.reducer;
