import { createSlice } from "@reduxjs/toolkit";
import Chains from "../../utils/consts/chains";
import getKintElectorate from "../../utils/democracy/electorate/kintsugi";
import getElectorate from "../../utils/democracy/electorate";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const referendumSlice = createSlice({
  name: "referendum",
  initialState: {
    isLoadingElectorate: false,
    electorate: 0,
    isLoadingVotes: true,
    referendumStatus: null,
  },
  reducers: {
    setIsLoadingVotes(state, { payload }) {
      state.isLoadingVotes = payload;
    },
    setIsLoadingElectorate(state, { payload }) {
      state.isLoadingElectorate = payload;
    },
    setElectorate(state, { payload }) {
      state.electorate = payload;
    },
    setReferendumStatus(state, { payload }) {
      state.referendumStatus = payload;
    },
  },
});

export const { setElectorate, setIsLoadingElectorate, setReferendumStatus } =
  referendumSlice.actions;

export const isLoadingElectorateSelector = (state) =>
  state.referendum.isLoadingElectorate;
export const electorateSelector = (state) => state.referendum.electorate;
export const referendumStatusSelector = (state) =>
  state.referendum.referendumStatus;

export const fetchElectorate = (api, height) => async (dispatch) => {
  let electorate;
  dispatch(setIsLoadingElectorate(true));
  try {
    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      electorate = await getKintElectorate(api, height);
    } else {
      electorate = await getElectorate(api);
    }
    dispatch(setElectorate(electorate));
  } finally {
    dispatch(setIsLoadingElectorate(false));
  }
};

export default referendumSlice.reducer;
