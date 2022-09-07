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

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    mode: getInitMode(),
  },
  reducers: {
    toggleMode(state) {
      const target =
        state.mode === mode.light || !state.mode ? mode.dark : mode.light;
      setCookie(CACHE_KEY.themeMode, target);
      state.mode = target;
    },
  },
});

export const modeSelector = (state) => state.setting.mode;

export const { toggleMode } = settingSlice.actions;

export default settingSlice.reducer;
