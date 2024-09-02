import { createSelector, createSlice } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";

const name = "myAccount";

const myAccountSlice = createSlice({
  name,
  initialState: {
    account: null,
  },
  reducers: {
    setAccount(state, { payload }) {
      state.account = payload;
    },
  },
});

export const { setAccount: setMyAccountInfo } = myAccountSlice.actions;

// It's loading if the value is the initial state.
export const isLoadingAccountInfoSelector = (state) =>
  state[name].account === null;
export const accountInfoSelector = (state) => {
  return state[name]?.account;
};
export const accountTotalBalanceSelector = createSelector(
  accountInfoSelector,
  (info) => {
    if (!info) {
      return 0;
    }

    const { free, reserved } = info;
    return new BigNumber(free || 0).plus(reserved || 0).toString();
  },
);

export const accountTransferrableBalanceSelector = createSelector(
  accountInfoSelector,
  existentialDepositSelector,
  (info, existentialDeposit) => {
    if (!info) {
      return 0;
    }

    const { free, frozen, reserved } = info;
    const frozenReserveDif = BigNumber(frozen).minus(reserved);
    return BigNumber(free || 0).minus(BigNumber.max(frozenReserveDif, existentialDeposit)).toNumber();
  },
);

export const accountLockedBalanceSelector = createSelector(
  accountInfoSelector,
  (info) => {
    if (!info) {
      return 0;
    }

    const { reserved, frozen } = info;
    return new BigNumber.max(reserved, frozen).toString();
  },
);

export default myAccountSlice.reducer;
