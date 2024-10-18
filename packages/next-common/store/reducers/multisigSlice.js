import { createSlice } from "@reduxjs/toolkit";
import { newErrorToast } from "./toastSlice";
import fetchMultisigs, {
  fetchMultisigsCount,
} from "next-common/services/multisig";

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

export const { setMyMultisigs, setMyMultisigsCount } = multisigSlice.actions;

export default multisigSlice.reducer;

export const fetchMyMultisigs =
  (chain, address, page = 1, pageSize = 15) =>
  async (dispatch) => {
    const { result, error } = await fetchMultisigs(
      chain,
      address,
      page,
      pageSize,
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

export const fetchMyMultisigsCount = (chain, address) => async (dispatch) => {
  const { result, error } = await fetchMultisigsCount(chain, address);
  if (error) {
    dispatch(newErrorToast(error.message));
    return;
  }

  const { multisigs } = result.data || {};
  const count = multisigs?.total || 0;
  dispatch(setMyMultisigsCount(count));
};

export const clearMyMultisigsData = () => async (dispatch) => {
  dispatch(setMyMultisigs(null));
  dispatch(setMyMultisigsCount(null));
};
