import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import summaryReducer from "./summarySlice";

export default combineReducers({
  user: userReducer,
  toast: toastReducer,
  node: nodeReducer,
  summary: summaryReducer,
});
