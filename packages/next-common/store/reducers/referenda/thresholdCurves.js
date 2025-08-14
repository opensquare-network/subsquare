import { useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";

export const name = "referendaThresholdCurves";

const referendaThresholdCurvesSlice = createSlice({
  name,
  initialState: {
    visible: false,
    tallyHistory: null,
  },
  reducers: {
    changePopupVisible(state, { payload }) {
      state.visible = payload;
    },
    setTallyHistory(state, { payload }) {
      state.tallyHistory = payload;
    },
  },
});

export default referendaThresholdCurvesSlice.reducer;
export const { setTallyHistory, changePopupVisible } =
  referendaThresholdCurvesSlice.actions;

export const useThresholdCurvesVisible = () => {
  return useSelector((state) => state[name]).visible;
};

export const useReferendaTallyHistory = () => {
  return useSelector((state) => state[name]).tallyHistory;
};
