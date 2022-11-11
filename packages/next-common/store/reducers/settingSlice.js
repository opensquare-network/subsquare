import { createSlice } from "@reduxjs/toolkit";
import { CACHE_KEY } from "../../utils/constants";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

const mode = Object.freeze({
  light: "light",
  dark: "dark",
});

export function getInitMode() {
  let result;
  try {
    result = getCookie(CACHE_KEY.themeMode) ?? mode.light;
  } catch (e) {
    // ignore parse error
    result = mode.light;
  }

  return result;
}

/**
 * @returns {string[]}
 */
export function getFoldedMenusCookie() {
  let foldedMenus = [];

  try {
    foldedMenus = (getCookie(CACHE_KEY.foldedMenus) ?? "").split(",");
  } catch (error) {}

  return foldedMenus.filter(Boolean);
}

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    mode: getInitMode(),
    foldedMenus: getFoldedMenusCookie(),
  },
  reducers: {
    toggleMode(state) {
      const target =
        state.mode === mode.light || !state.mode ? mode.dark : mode.light;
      setCookie(CACHE_KEY.themeMode, target);
      state.mode = target;
    },
    setMode(state, { payload }) {
      if (getCookie(CACHE_KEY.themeMode) !== payload) {
        setCookie(CACHE_KEY.themeMode, payload);
      }
      state.mode = payload;
    },

    /**
     * @description set single
     */
    setFoldedMenu(state, { payload }) {
      let foldedMenus = getFoldedMenusCookie();
      const { name, folded } = payload ?? {};

      if (folded) {
        foldedMenus.push(name);
      } else {
        foldedMenus = foldedMenus.filter((i) => i !== name);
      }

      setCookie(CACHE_KEY.foldedMenus, foldedMenus.join(","));

      state.foldedMenus = foldedMenus;
    },
  },
});

export const modeSelector = (state) => state.setting.mode;
export const foldedMenusSelector = (state) => state.setting.foldedMenus;

export const { toggleMode, setMode, setFoldedMenu } = settingSlice.actions;

export default settingSlice.reducer;
