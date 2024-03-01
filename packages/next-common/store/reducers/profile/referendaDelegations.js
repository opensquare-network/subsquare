import { createSlice } from "@reduxjs/toolkit";

const name = "profileReferendaDelegations";

const profileReferendaDelegationSlice = createSlice({
  name,
  initialState: {
    delegations: null,
  },
  reducers: {
    setDelegations(state, { payload }) {
      state.delegations = payload;
    },
  },
});

export const { setDelegations: setProfileReferendaDelegations } =
  profileReferendaDelegationSlice.actions;

export const profileReferendaDelegationsSelector = (state) =>
  state[name].delegations;

export default profileReferendaDelegationSlice.reducer;
