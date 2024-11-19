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
    api.query.assets.account.multi(multiAccountKey).then((res) => {
      if (res) {
        dispatch(setMultiAccounts(res));
      }
    });

    try {
      const result = await api.query.assets.account.multi(multiAccountKey);
      dispatch(setMultiAccounts(result));
    } catch (error) {
      throw new Error("Query multiAccouts failed.");
    }
  };

export const clearMultiAccounts = () => async (dispatch) => {
  dispatch(setMultiAccounts(null));
};
