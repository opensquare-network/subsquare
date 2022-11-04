import { combineReducers } from "@reduxjs/toolkit";

import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import tipReducer from "./tipSlice";
import settingReducer from "./settingSlice";
import referendumReducer from "./referendumSlice";

export default combineReducers({
  toast: toastReducer,
  node: nodeReducer,
  chain: chainReducer,
  tip: tipReducer,
  setting: settingReducer,
  referendum: referendumReducer,
});
