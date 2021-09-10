import { createSlice } from "@reduxjs/toolkit";

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
  const { result } = await nextApi.fetch(
    "user/profile",
    {},
    {
      credentials: true,
    }
  );
  if (result) dispatch(setUser(result));
};

export const logout = () => async (dispatch) => {
  await nextApi.post("auth/logout");
  dispatch(setUser(null));
};

export const userSelector = (state) => state.user.user;

export default userSlice.reducer;
