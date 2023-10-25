import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: undefined,
    isEditingPost: false,
    loginOpen: false,
    redirectUrl: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setEditingPost: (state, { payload }) => {
      state.isEditingPost = payload;
    },
    setLoginOpen: (state, { payload }) => {
      state.loginOpen = payload;
    },
    setRedirectUrl(state, { payload }) {
      state.redirectUrl = payload;
    },
  },
});

export const isEditingPostSelector = (state) => state.user?.isEditingPost;
export const loginOpenSelector = (state) => state.user?.loginOpen;
export const loginRedirectUrlSelector = (state) => state.user?.redirectUrl;

export const { setUser, setEditingPost, setLoginOpen, setRedirectUrl } =
  userSlice.actions;

export default userSlice.reducer;
