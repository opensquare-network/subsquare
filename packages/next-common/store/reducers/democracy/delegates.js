import { createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";

const name = "democracyDelegates";

const democracyDelegatesSlice = createSlice({
  name,
  initialState: {
    delegates: null,
    isLoading: false,
    trigger: 0,
  },
  reducers: {
    setDelegates(state, { payload }) {
      state.delegates = payload;
    },
    setLoading(state, { payload }) {
      state.isLoading = payload;
    },
    triggerUpdate(state) {
      state.trigger = state.trigger + 1;
    },
  },
});

export const {
  setDelegates: setDemocracyDelegates,
  setLoading: setDemocracyDelegatesLoading,
  triggerUpdate: setDemocracyDelegatesTriggerUpdate,
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
export const democracyDelegatesTriggerUpdateSelector = (state) =>
  state[name].trigger;

export default democracyDelegatesSlice.reducer;
