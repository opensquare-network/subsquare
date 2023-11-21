import { createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "./toastSlice";

const multisigSlice = createSlice({
  name: "multisig",
  initialState: {
    myMultisigs: [],
  },
  reducers: {
    setMyMultisigs(state, { payload }) {
      state.myMultisigs = payload;
    },
  },
});

export const myMultisigsSelector = (state) => state.multisig.myMultisigs;

export const { setMyMultisigs } = multisigSlice.actions;

export default multisigSlice.reducer;

const getMultisigsQuery = (address, page, pageSize) => `query MyMultisigsQuery {
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
          operationName: "MyMultisigsQuery",
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
