import { combineReducers } from "@reduxjs/toolkit";

import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import referendumReducer from "./referendumSlice";
import gov2ReferendumReducer from "./gov2ReferendumSlice";
import cmdkReducer from "./cmdkSlice";
import userReducer from "./userSlice";
import fellowship from "./fellowship";
import referenda from "./referenda";
import democracy from "./democracy";
import layoutReducer from "./layoutSlice";
import preImagesReducer from "./preImagesSlice";
import myOnChainData from "./myOnChainData";
import detailReducer from "./detailSlice";
import multisigSlice from "./multisigSlice";
import profile from "./profile";
import editorReducer from "./editorSlice";
import avatarReducer from "./avatarSlice";

// TODO: clean unnecessay reducers, use `createGlobalState` instead
export const commonReducers = {
  // baseLayout header
  node: nodeReducer, // node switcher
  chain: chainReducer, // network switcher
  // baseLayout nav menu
  avatar: avatarReducer,
  // baseLayout global
  user: userReducer, // global connect popup
  cmdk: cmdkReducer,
  toast: toastReducer,
  // baseLayout children
  layout: layoutReducer,
  detail: detailReducer,
  editor: editorReducer, // removable
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
