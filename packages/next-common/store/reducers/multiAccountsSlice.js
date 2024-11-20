import { createSlice } from "@reduxjs/toolkit";

const multiAccountsSlice = createSlice({
  name: "multiAccounts",
  initialState: {
    accounts: null,
  },
  reducers: {
    setMultiAccounts(state, { payload }) {
      state.accounts = payload;
    },
  },
});

export const multiAccountsSelector = (state) => state.multiAccounts.accounts;

export const { setMultiAccounts } = multiAccountsSlice.actions;

export default multiAccountsSlice.reducer;

export const fetchMultiAccounts =
  (multiAccountKey, api) => async (dispatch) => {
    if (!api || !multiAccountKey) {
      return;
    }

    api.query.assets.account.multi(multiAccountKey).then((result) => {
      const multiAccounts = result?.map((option) => {
        if (option.isNone) {
          return null;
        }

        const { balance, status = {} } = option.unwrap();
        const { isFrozen } = status;

        return {
          balance: balance.toJSON(),
          status: {
            isFrozen,
          },
        };
      });
      dispatch(setMultiAccounts(multiAccounts));
    });
  };

export const clearMultiAccounts = () => async (dispatch) => {
  dispatch(setMultiAccounts(null));
};
