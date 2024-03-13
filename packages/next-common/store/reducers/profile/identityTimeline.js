import { createSlice } from "@reduxjs/toolkit";

const name = "profileIdentityTimeline";

const profileIdentityTimelineSlice = createSlice({
  name,
  initialState: {
    identityTimeline: null,
  },
  reducers: {
    setIdentityTimeline(state, { payload }) {
      state.identityTimeline = payload;
    },
  },
});

export const { setIdentityTimeline: setProfileIdentityTimeline } =
  profileIdentityTimelineSlice.actions;

export const profileIdentityTimelineSelector = (state) =>
  state[name].identityTimeline;

export default profileIdentityTimelineSlice.reducer;
