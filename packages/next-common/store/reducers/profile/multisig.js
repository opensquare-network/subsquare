import { createSlice } from "@reduxjs/toolkit";
import fetchMultisigs, {
  fetchMultisigsCount,
} from "next-common/services/multisig";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

const multisigSlice = createSlice({
  name: "profileMultisig",
  initialState: {
    multisigs: null,
    activeMultisigsCount: null,
  },
  reducers: {
    setMultisigs(state, { payload }) {
      state.multisigs = payload;
    },
    setActiveMultisigsCount(state, { payload }) {
      state.activeMultisigsCount = payload;
    },
  },
});

export const {
  setMultisigs: setProfileMultisigs,
  setActiveMultisigsCount: setProfileActiveMultisigsCount,
} = multisigSlice.actions;

export const profileMultisigsSelector = (state) =>
  state.profileMultisig.multisigs;
export const profileActiveMultisigsCountSelector = (state) =>
  state.profileMultisig.activeMultisigsCount;

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

export const fetchProfileMultisigsCount =
  (chain, address) => async (dispatch) => {
    const { result, error } = await fetchMultisigsCount(chain, address);
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }

    const { multisigs } = result.data || {};
    const count = multisigs?.total || 0;
    dispatch(setProfileActiveMultisigsCount(count));
  };

export default multisigSlice.reducer;
