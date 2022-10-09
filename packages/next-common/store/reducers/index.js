import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import treasuryProposalReducer from "./treasuryProposalSlice";
import tipReducer from "./tipSlice";
import settingReducer from "./settingSlice";
import referendumReducer from "./referendumSlice";

export default combineReducers({
  user: userReducer,
  toast: toastReducer,
  node: nodeReducer,
  chain: chainReducer,
  treasuryProposal: treasuryProposalReducer,
  tip: tipReducer,
  setting: settingReducer,
  referendum: referendumReducer,
});
