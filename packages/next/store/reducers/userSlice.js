import { createSlice } from "@reduxjs/toolkit";

import nextApi from "services/nextApi";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    profile: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setUserProfile: (state, { payload }) => {
      state.profile = payload;
    },
  },
});

export const { setUser, setUserProfile } = userSlice.actions;

export const fetchUserProfile = (authToken) => async (dispatch) => {
  const { result } = await nextApi.authGet("user/profile", authToken);
  if (result) dispatch(setUserProfile(result));
};

export const logout = () => async (dispatch) => {
  dispatch(setUser(null));
};

export const userSelector = (state) => state.user.user;

export const userProfileSelector = (state) => state.user.profile;

export default userSlice.reducer;
