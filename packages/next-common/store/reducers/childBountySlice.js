import { createSelector, createSlice } from "@reduxjs/toolkit";

const childBountySlice = createSlice({
  name: "childBounty",
  initialState: {
    /**
     * store on chain child bounty entity, should be subscribed when enter into child bounty detail page
     */
    childBounty: null,
  },
  reducers: {
    setChildBounty(state, { payload }) {
      state.childBounty = payload;
    },
  },
});

export const { setChildBounty } = childBountySlice.actions;

export const childBountySelector = (state) => state.childBounty.childBounty; // child bounty on chain data
export const childBountyStatusSelector = createSelector(childBountySelector, childBounty => {
  return childBounty ? childBounty.status : null;
});

export default childBountySlice.reducer;
