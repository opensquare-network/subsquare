import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: undefined,
    isEditingPost: false,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setEditingPost: (state, { payload }) => {
      state.isEditingPost = payload;
    },
  },
});

export const isEditingPostSelector = (state) => state.user?.isEditingPost;
export const { setUser, setEditingPost } = userSlice.actions;

export default userSlice.reducer;
