import { createSlice } from "@reduxjs/toolkit";

export const name = "referendaTallyHistory";

const referendaVotesSlice = createSlice({
  name,
  initialState: {
    tallyHistory: null,
  },
  reducers: {
    setTallyHistory(state, { payload }) {
      state.tallyHistory = payload;
    },
  },
});

export const { setTallyHistory } = referendaVotesSlice.actions;

export const clearTallyHistory = () => async (dispatch) => {
  dispatch(setTallyHistory(null));
};

export const referendaTallyHistorySelector = (state) =>
  state[name].tallyHistory;

export default referendaVotesSlice.reducer;
