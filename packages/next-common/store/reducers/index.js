import { combineReducers } from "@reduxjs/toolkit";

import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import referendumReducer from "./referendumSlice";
import gov2ReferendumReducer from "./gov2ReferendumSlice";
import cmdkReducer from "./cmdkSlice";
import userReducer from "./userSlice";
import childBountyReducer from "./childBountySlice";
import fellowship from "./fellowship";
import referenda from "./referenda";
import navReducer from "./navSlice";

export default combineReducers({
  toast: toastReducer,
  node: nodeReducer,
  chain: chainReducer,
  referendum: referendumReducer,
  gov2Referendum: gov2ReferendumReducer,
  cmdk: cmdkReducer,
  user: userReducer,
  childBounty: childBountyReducer,
  nav: navReducer,
  ...fellowship,
  ...referenda,
});
