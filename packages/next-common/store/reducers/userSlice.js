import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isEditingPost: false,
    loginOpen: false,
    redirectUrl: null,
    initView: "web3",
  },
  reducers: {
    setEditingPost: (state, { payload }) => {
      state.isEditingPost = payload;
    },
    setLoginOpen: (state, { payload }) => {
      state.loginOpen = payload;
    },
    setRedirectUrl(state, { payload }) {
      state.redirectUrl = payload;
    },
    setInitView(state, { payload }) {
      state.initView = payload;
    },
  },
});

export const isEditingPostSelector = (state) => state.user?.isEditingPost;
export const loginOpenSelector = (state) => state.user?.loginOpen;
export const loginRedirectUrlSelector = (state) => state.user?.redirectUrl;
export const initViewSelector = (state) => state.user?.initView;

export const { setEditingPost, setLoginOpen, setRedirectUrl, setInitView } =
  userSlice.actions;

export default userSlice.reducer;
