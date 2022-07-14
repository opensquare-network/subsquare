import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { theme: "light" },
  reducers: {
    setTheme(state, { payload }) {
      state.theme = payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export const themeSelector = (state) => state.theme;

export default themeSlice.reducer;
