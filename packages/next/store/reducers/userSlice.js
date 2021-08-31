import { createSlice } from "@reduxjs/toolkit";
import Cookies from "cookies";

import nextApi from "services/nextApi";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: undefined,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const fetchUserProfile = () => async (dispatch) => {
  const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTQ4OGUzOTAwZTU5NTI4YWM4MzJmZSIsImVtYWlsIjoiNjM0NTU0ODE1QHFxLmNvbSIsInVzZXJuYW1lIjoieW9zaGl5dWtpIiwiaWF0IjoxNjMwMzk5MjU3LCJleHAiOjE2MzEwMDQwNTd9.tF0unQYwDz-XgMiP8BQYPeYtaWPKbN94UT9aaPZvOYQ`;
  let options = {}
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      credentials:"include",
    };
  }
  const { result } = await nextApi.fetch("user/profile", {}, options);
  if (result) dispatch(setUser(result));
};

export const logout = () => async (dispatch) => {
  await nextApi.post("auth/logout");
  dispatch(setUser(null));
};

export const userSelector = (state) => state.user.user;

export default userSlice.reducer;
