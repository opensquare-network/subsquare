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
  hasTreasury: false,
  modules: mergeChainModules({
    democracy: false,
    treasury: false,
    council: false,
    technicalCommittee: false,
  }),
};

export default kabocha;
