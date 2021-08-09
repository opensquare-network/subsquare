import { createSlice } from "@reduxjs/toolkit";

import nextApi from "services/nextApi";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const logout = () => async (dispatch) => {
  dispatch(setUser(null));
};

export const userSelector = (state) => state.user.user;

export default userSlice.reducer;
