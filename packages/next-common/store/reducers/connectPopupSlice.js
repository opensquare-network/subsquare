const { createSlice } = require("@reduxjs/toolkit");

const name = "connectPopup";

const connectPopupSlice = createSlice({
  name,
  initialState: {
    // web3, web3evm, account
    view: "web3",
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
