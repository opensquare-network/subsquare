import { createSlice } from "@reduxjs/toolkit";

const avatarSlice = createSlice({
  name: "avatar",
  initialState: {
    trigger: 0,
  },
  reducers: {
    setTrigger(state) {
      state.trigger = state.trigger + 1;
    },
  },
});

export const { setTrigger: setAvatarTrigger } = avatarSlice.actions;

export const avatarTriggerSelector = (state) => state.avatar.trigger;

export default avatarSlice.reducer;
