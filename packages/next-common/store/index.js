import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

export default function newReduxStore() {
  return configureStore({ reducer: rootReducer });
}
