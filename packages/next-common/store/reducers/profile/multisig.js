import { createSlice } from "@reduxjs/toolkit";
import fetchMultisigs from "next-common/services/multisig";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

const multisigSlice = createSlice({
  name: "profileMultisig",
  initialState: {
    multisigs: null,
  },
  reducers: {
    setMultisigs(state, { payload }) {
      state.multisigs = payload;
    },
  },
});

export const {
  setMultisigs: setProfileMultisigs,
  setActiveMultisigsCount: setProfileActiveMultisigsCount,
} = multisigSlice.actions;

export const profileMultisigsSelector = (state) =>
  state.profileMultisig.multisigs;

export const fetchProfileMultisigs =
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
    dispatch(setProfileMultisigs(data));
  };

export default multisigSlice.reducer;
