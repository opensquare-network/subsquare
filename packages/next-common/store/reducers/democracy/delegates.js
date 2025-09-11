import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "next-common/services/nextApi";

const name = "democracyDelegates";

const democracyDelegatesSlice = createSlice({
  name,
  initialState: {
    delegates: null,
    myDelegate: null,
    isLoading: false,
    trigger: 0,
  },
  reducers: {
    setDelegates(state, { payload }) {
      state.delegates = payload;
    },
    setMyDelegate(state, { payload }) {
      state.myDelegate = payload;
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
  setMyDelegate: setDemocracyMyDelegate,
  setLoading: setDemocracyDelegatesLoading,
  triggerUpdate: setDemocracyDelegatesTriggerUpdate,
} = democracyDelegatesSlice.actions;

export const fetchDemocracyDelegates = (sort, page = 1, pageSize = 18) => {
  if (sort === "participation") {
    sort = "participation_rate";
  }

  return async (dispatch) => {
    try {
      dispatch(setDemocracyDelegatesLoading(true));
      const { result } = await backendApi.fetch(
        "delegation/democracy/delegates",
        {
          sort,
          page,
          pageSize,
        },
      );
      dispatch(setDemocracyDelegates(result));
    } finally {
      dispatch(setDemocracyDelegatesLoading(false));
    }
  };
};

export const democracyDelegatesSelector = (state) => state[name].delegates;
export const democracyMyDelegateSelector = (state) => state[name].myDelegate;
export const democracyDelegatesTriggerUpdateSelector = (state) =>
  state[name].trigger;

export default democracyDelegatesSlice.reducer;
