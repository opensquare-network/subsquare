import { createSlice } from "@reduxjs/toolkit";

const multisigSlice = createSlice({
  name: "profileMultisig",
  initialState: {
    myMultisigs: null,
    myMultisigsCount: null,
  },
  reducers: {
    setMyMultisigs(state, { payload }) {
      state.myMultisigs = payload;
    },
    setMyMultisigsCount(state, { payload }) {
      state.myMultisigsCount = payload;
    },
  },
});

export default multisigSlice.reducer;
