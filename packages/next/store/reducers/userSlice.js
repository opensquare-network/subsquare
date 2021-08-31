import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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
  const { result } = await nextApi.fetch("user/profile");
  if (result) dispatch(setUser(result));
};

export const logout = () => async (dispatch) => {
  await nextApi.post("auth/logout");
  if (process.env.MODE !== "cors-api-server") {
    Cookies.set("auth-token");
  }
  dispatch(setUser(null));
};

export const userSelector = (state) => state.user.user;

export default userSlice.reducer;
