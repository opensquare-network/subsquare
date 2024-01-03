import { createSlice } from "@reduxjs/toolkit";

export const LoginResult = {
  Connected: "connected",
  LoggedIn: "loggedIn",
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    isEditingPost: false,
    loginOpen: false,
    loginResult: null,
  },
  reducers: {
    setEditingPost: (state, { payload }) => {
      state.isEditingPost = payload;
    },
    setLoginOpen: (state, { payload }) => {
      state.loginOpen = payload;
    },
    setLoginResult(state, { payload }) {
      state.loginResult = payload;
    },
  },
});

export const isEditingPostSelector = (state) => state.user?.isEditingPost;
export const loginOpenSelector = (state) => state.user?.loginOpen;
export const loginResultSelector = (state) => state.user?.loginResult;

export const { setEditingPost, setLoginOpen, setLoginResult } =
  userSlice.actions;

export default userSlice.reducer;
