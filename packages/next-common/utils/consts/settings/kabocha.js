import { mergeChainModules } from "./common/modules";

const kabocha = {
  value: "kabocha",
  name: "Kabocha",
  icon: "kabocha.svg",
  hideHeight: true,
  // identity: "kabocha",
  // symbol: "",
  // decimals: 0,
  // hasElections: true,
  hasSubscan: true,
  hasTechComm: false,
  hasTreasury: false,
  modules: mergeChainModules({
    democracy: false,
    treasury: false,
  }),
};

export default kabocha;
