import { kusamaDvDelegates } from "./kusama";
import { polkadotDvDelegates } from "./polkadot";

const chainDvDelegates = {
  polkadot: polkadotDvDelegates,
  kusama: kusamaDvDelegates,
};

export default chainDvDelegates;
