import { createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";

const name = "referendaDelegates";

const referendaDelegatesSlice = createSlice({
  name,
  initialState: {
    delegates: null,
    isLoading: false,
  },
  reducers: {
    setDelegates(state, { payload }) {
      state.delegates = payload;
    },
    setLoading(state, { payload }) {
      state.isLoading = payload;
    },
  },
});

export const {
  setDelegates: setReferendaDelegates,
  setLoading: setReferendaDelegatesLoading,
} = referendaDelegatesSlice.actions;

export const fetchReferendaDelegates =
  (page = 1, pageSize = 18) =>
  async (dispatch) => {
    try {
      dispatch(setReferendaDelegatesLoading(true));
      const { result } = await nextApi.fetch("delegation/referenda/delegates", {
        page,
        pageSize,
      });
      dispatch(setReferendaDelegates(result));
    } finally {
      dispatch(setReferendaDelegatesLoading(false));
    }
  };

export const referendaDelegatesSelector = (state) => state[name].delegates;

export default referendaDelegatesSlice.reducer;
