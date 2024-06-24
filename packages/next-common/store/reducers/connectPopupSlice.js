import { CONNECT_POPUP_DEFAULT_VIEW } from "next-common/utils/constants";

const { createSlice } = require("@reduxjs/toolkit");

const name = "connectPopup";

const connectPopupSlice = createSlice({
  name,
  initialState: {
    view: CONNECT_POPUP_DEFAULT_VIEW,
  },
  reducers: {
    setConnectPopupView(state, { payload }) {
      state.view = payload;
    },
  },
});

export const { setConnectPopupView } = connectPopupSlice.actions;

export const connectPopupViewSelector = (state) => state[name].view;

export default connectPopupSlice.reducer;
