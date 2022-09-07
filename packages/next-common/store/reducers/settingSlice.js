import { createSlice } from "@reduxjs/toolkit";

const mode = Object.freeze({
  light: "light",
  dark: "dark",
});

const localstorageKey = "subsquare-mode";

const converter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  },
};

function setCookie(key, value) {
  if (typeof document === "undefined") {
    return;
  }
  key = encodeURIComponent(key)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);

  return (document.cookie = key + "=" + converter.write(value, key));
}

function getCookie(key) {
  if (typeof document === "undefined" || (arguments.length && !key)) {
    return;
  }

  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  var cookies = document.cookie ? document.cookie.split("; ") : [];
  var jar = {};
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split("=");
    var value = parts.slice(1).join("=");

    try {
      var foundKey = decodeURIComponent(parts[0]);
      jar[foundKey] = converter.read(value, foundKey);

      if (key === foundKey) {
        break;
      }
    } catch (e) {}
  }

  return key ? jar[key] : jar;
}

export function getInitMode() {
  let result;
  try {
    result = getCookie(localstorageKey) ?? mode.light;
  } catch (e) {
    // ignore parse error
    result = mode.light;
  }
  // result = mode.light;

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
      setCookie(localstorageKey, target);
      state.mode = target;
    },
  },
});

export const modeSelector = (state) => state.setting.mode;

export const { toggleMode } = settingSlice.actions;

export default settingSlice.reducer;
