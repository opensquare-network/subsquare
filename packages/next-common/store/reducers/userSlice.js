import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: undefined,
    isEditingPost: false,
    loginOpen: false,
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
  },
});

export const isEditingPostSelector = (state) => state.user?.isEditingPost;
export const loginOpenSelector = (state) => state.user?.loginOpen;

export const { setUser, setEditingPost, setLoginOpen } = userSlice.actions;

export default userSlice.reducer;
