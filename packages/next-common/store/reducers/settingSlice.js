import { createSlice } from "@reduxjs/toolkit";

const mode = Object.freeze({
  light: "light",
  dark: "dark",
});

const localstorageKey = "subsquare-mode";

export function getInitMode() {
  let result;
  try {
    result = localStorage.getItem(localstorageKey);
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
      localStorage.setItem(localstorageKey, target);
      state.mode = target;
    },
  },
});

export const modeSelector = (state) => state.setting.mode;

export const { toggleMode } = settingSlice.actions;

export default settingSlice.reducer;
