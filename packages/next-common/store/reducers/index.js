import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";

export default combineReducers({
  user: userReducer,
  toast: toastReducer,
  node: nodeReducer,
});
