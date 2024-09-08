import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
  name: "nav",
  initialState: {
    menu: {
      showMainMenu: true,
    },
  },
  reducers: {
    setMenuShowMainMenu(state, { payload }) {
      state.menu.showMainMenu = payload;
    },
  },
});

export const { setMenuShowMainMenu } = navSlice.actions;

export const navMenuShowMainMenuSelector = (state) =>
  state.nav.menu.showMainMenu;

export default navSlice.reducer;
