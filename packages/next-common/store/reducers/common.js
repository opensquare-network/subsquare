import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    price: null, // native token price
  },
  reducers: {
    setPrice(state, { payload }) {
      state.price = payload;
    },
  },
});

export const { setPrice: setNativeTokenPrice } = commonSlice.actions;

export const nativeTokenPriceSelector = (state) => state.common.price;

export default commonSlice.reducer;
