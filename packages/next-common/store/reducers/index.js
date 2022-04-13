import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import treasuryProposalReducer from "./treasuryProposalSlice";

export default combineReducers({
  user: userReducer,
  toast: toastReducer,
  node: nodeReducer,
  chain: chainReducer,
  treasuryProposal: treasuryProposalReducer,
});
