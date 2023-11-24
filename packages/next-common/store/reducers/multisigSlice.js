import { createSelector, createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "./toastSlice";
import getChainSettings from "next-common/utils/consts/settings";

const multisigSlice = createSlice({
  name: "multisig",
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

export const myMultisigsSelector = (state) => state.multisig.myMultisigs;
export const myMultisigsCountSelector = (state) =>
  state.multisig.myMultisigsCount;
export const multisigsIsLoadingSelector = createSelector(
  myMultisigsSelector,
  (multisigs) => multisigs === null,
);

export const { setMyMultisigs, setMyMultisigsCount } = multisigSlice.actions;

export default multisigSlice.reducer;

function getMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if (!settings?.multisigApiPrefix) {
    throw new Error(`Can not find multisig settings for ${chain}`);
  }

  return `https://${settings.multisigApiPrefix}-multisig-api.statescan.io/graphql`;
}

const getMultisigsQuery = (address, page, pageSize) => `query MyQuery {
  multisigs(
    limit: ${pageSize}
    offset: ${(page - 1) * pageSize}
    signatory: "${address}"
  ) {
    total
    offset
    limit
    multisigs {
      address
      approvals
      call
      callHash
      callHex
      signatories
      threshold
      when {
        index
        height
      }
      state {
        name
      }
    }
  }
}`;

export const fetchMyMultisigs =
  (chain, address, page = 1, pageSize = 25) =>
  async (dispatch) => {
    const { result, error } = await nextApi.fetch(
      getMultisigApiUrl(chain),
      {},
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extensions: {},
          operationName: "MyQuery",
          query: getMultisigsQuery(address, page, pageSize),
        }),
      },
    );

    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }

    const { multisigs } = result.data || {};

    const data = {
      page,
      pageSize,
      total: multisigs?.total || 0,
      items: multisigs?.multisigs || [],
    };

    dispatch(setMyMultisigs(data));
  };

const getMultisigsCountQuery = (address) => `query MyQuery {
  multisigs(
    signatory: "${address}"
    multisigState: APPROVING
    limit: 10
    offset: 0
  ) {
    total
  }
}`;

export const fetchMyMultisigsCount = (chain, address) => async (dispatch) => {
  const { result, error } = await nextApi.fetch(
    getMultisigApiUrl(chain),
    {},
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extensions: {},
        operationName: "MyQuery",
        query: getMultisigsCountQuery(address),
      }),
    },
  );

  if (error) {
    dispatch(newErrorToast(error.message));
    return;
  }

  const { multisigs } = result.data || {};

  const count = multisigs?.total || 0;

  dispatch(setMyMultisigsCount(count));
};
