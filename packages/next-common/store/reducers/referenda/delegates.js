import { createSlice } from "@reduxjs/toolkit";
import nextApi from "next-common/services/nextApi";

const name = "referendaDelegates";

const referendaDelegatesSlice = createSlice({
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
    setTriggerUpdate(state) {
      state.trigger = state.trigger + 1;
    },
  },
});

export const {
  setDelegates: setReferendaDelegates,
  setMyDelegate: setReferendaMyDelegate,
  setLoading: setReferendaDelegatesLoading,
  setTriggerUpdate: setReferendaDelegatesTriggerUpdate,
} = referendaDelegatesSlice.actions;

export const fetchReferendaDelegates = (sort, page = 1, pageSize = 18) => {
  if (sort === "participation") {
    sort = "participation_rate";
  }

  return async (dispatch) => {
    try {
      dispatch(setReferendaDelegatesLoading(true));
      const { result } = await nextApi.fetch("delegation/referenda/delegates", {
        sort,
        page,
        pageSize,
      });
      dispatch(setReferendaDelegates(result));
    } finally {
      dispatch(setReferendaDelegatesLoading(false));
    }
  };
};

export const referendaDelegatesSelector = (state) => state[name].delegates;
export const referendaMyDelegateSelector = (state) => state[name].myDelegate;
export const referendaDelegatesTriggerUpdateSelector = (state) =>
  state[name].trigger;

export default referendaDelegatesSlice.reducer;
