import { combineReducers } from "@reduxjs/toolkit";

import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import referendumReducer from "./referendumSlice";
import gov2ReferendumReducer from "./gov2ReferendumSlice";
import userReducer from "./userSlice";
import fellowship from "./fellowship";
import referenda from "./referenda";
import democracy from "./democracy";
import preImagesReducer from "./preImagesSlice";
import myOnChainData from "./myOnChainData";
import multisigSlice from "./multisigSlice";
import profile from "./profile";
import avatarReducer from "./avatarSlice";

export const commonReducers = {
  // baseLayout header
  node: nodeReducer, // node switcher
  chain: chainReducer, // network switcher
  // baseLayout global
  user: userReducer, // global connect popup
  toast: toastReducer,
  avatar: avatarReducer,
};

const businessReducers = {
  referendum: referendumReducer,
  gov2Referendum: gov2ReferendumReducer,
  ...fellowship,
  ...referenda,
  ...democracy,
  preImages: preImagesReducer,
  ...myOnChainData,
  multisig: multisigSlice,
  ...profile,
};

export default combineReducers({
  ...commonReducers,
  ...businessReducers,
});
