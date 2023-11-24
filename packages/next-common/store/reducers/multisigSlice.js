import { createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "./toastSlice";

const multisigSlice = createSlice({
  name: "multisig",
  initialState: {
    myMultisigs: [],
    myMultisigsCount: 0,
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

export const { setMyMultisigs, setMyMultisigsCount } = multisigSlice.actions;

export default multisigSlice.reducer;

const getMultisigsQuery = (address, page, pageSize) => `query MyQuery {
  multisigs(
    limit: ${pageSize}
    offset: ${(page - 1) * pageSize}
    account: "${address}"
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
      deposit
      depositor
      id
      isFinal
      signatories
      signatoriesCount
      threshold
      when {
        index
        height
      }
      state {
        name
        args
      }
      indexer {
        extrinsicIndex
        eventIndex
        blockTime
        blockHeight
        blockHash
      }
    }
  }
}`;

export const fetchMyMultisigs =
  (chain, address, page = 1, pageSize = 25) =>
  async (dispatch) => {
    const { result, error } = await nextApi.fetch(
      `https://${chain}-multisig-api.statescan.io/graphql`,
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
    signatory: ""
    account: "${address}"
    limit: 0
    offset: 0
  ) {
    total
  }
}`;

export const fetchMyMultisigsCount = (chain, address) => async (dispatch) => {
  const { result, error } = await nextApi.fetch(
    `https://${chain}-multisig-api.statescan.io/graphql`,
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
