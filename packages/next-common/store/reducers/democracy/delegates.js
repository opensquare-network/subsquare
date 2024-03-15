import { createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";

const name = "democracyDelegates";

const democracyDelegatesSlice = createSlice({
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
  setDelegates: setDemocracyDelegates,
  setLoading: setDemocracyDelegatesLoading,
} = democracyDelegatesSlice.actions;

export const fetchDemocracyDelegates =
  (page = 1, pageSize = 18) =>
  async (dispatch) => {
    try {
      dispatch(setDemocracyDelegatesLoading(true));
      const { result } = await nextApi.fetch("delegation/democracy/delegates", {
        page,
        pageSize,
      });
      dispatch(setDemocracyDelegates(result));
    } finally {
      dispatch(setDemocracyDelegatesLoading(false));
    }
  };

export const democracyDelegatesSelector = (state) => state[name].delegates;

export default democracyDelegatesSlice.reducer;
