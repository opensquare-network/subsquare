import { createSlice } from "@reduxjs/toolkit";

const name = "referendaDelegations";

const referendaDelegationSlice = createSlice({
  name,
  initialState: {
    delegations: [],
    isLoading: false,
  },
  reducers: {
    setDelegations(state, { payload }) {
      state.delegations = payload;
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
  },
});

export const {
  setDelegations: setReferendaDelegations,
  setIsLoading: setIsReferendaDelegationsLoading,
} = referendaDelegationSlice.actions;

export const referendaDelegationsSelector = (state) => state[name].delegations;
export const isReferendaDelegationsLoadingSelector = (state) =>
  state[name].isLoading;

export default referendaDelegationSlice.reducer;
