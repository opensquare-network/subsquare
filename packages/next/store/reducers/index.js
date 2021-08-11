import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import toastReducer from "./toastSlice";

export default combineReducers({
  user: userReducer,
  toast: toastReducer,
});
