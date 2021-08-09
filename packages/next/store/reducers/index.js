import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";

export default combineReducers({
  user: userReducer,
});
