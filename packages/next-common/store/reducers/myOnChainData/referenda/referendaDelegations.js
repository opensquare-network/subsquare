import { createSlice } from "@reduxjs/toolkit";

const name = "referendaDelegations";

const referendaDelegationSlice = createSlice({
  name,
  initialState: {
    delegations: [],
  },
  reducers: {
    setDelegations(state, { payload }) {
      state.delegations = payload;
    },
  },
});

export const { setDelegations: setReferendaDelegations } =
  referendaDelegationSlice.actions;

export const referendaDelegationsSelector = (state) => state[name].delegations;

export default referendaDelegationSlice.reducer;
