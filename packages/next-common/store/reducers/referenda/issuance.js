import { createSlice } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

const name = "referendaIssuance";

const referendaIssuanceSlice = createSlice({
  name,
  initialState: {
    issuance: 0,
    inactive: 0,
  },
  reducers: {
    setReferendaIssuance(state, { payload }) {
      state.issuance = payload;
    },
    setReferendaInActive(state, { payload }) {
      state.inactive = payload;
    },
  },
});

export const { setReferendaIssuance, setReferendaInActive } = referendaIssuanceSlice.actions;

export const referendaIssuanceSelector = state => state[name].issuance;
export const inactiveIssuanceSelector = state => {
  const { issuance, inactive } = state[name];
  return new BigNumber(issuance).minus(inactive).toString();
};

export default referendaIssuanceSlice.reducer;
