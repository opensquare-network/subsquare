import { createSlice } from "@reduxjs/toolkit";

const MAX_TOASTS = 6;
let count = 0;

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast(state, { payload }) {
      const toastId = count++;
      if (state.toasts.length >= MAX_TOASTS) {
        const i = state.toasts.findIndex((item) => !item.sticky);
        state.toasts.splice(i, 1);
      }
      state.toasts.push({ id: toastId, ...payload });
    },
    removeToast(state, { payload }) {
      state.toasts = state.toasts.filter((item) => item.id !== payload);
    },
    updateToast(state, { payload }) {
      state.toasts = state.toasts.map((t) => {
        if (t.id === payload.id) {
          return { ...t, ...payload };
        }
        return t;
      });
    },
  },
});

export const toastsSelector = (state) => state.toast.toasts;

export const { addToast, removeToast, updateToast } = toastSlice.actions;

export const newToastId = () => count++;

export default toastSlice.reducer;
