import OptionGroups from "./menuGroups";

const DEFAULT_BASILISK_NODES = [
  {
    name: "OnFinality",
    url: "wss://basilisk.api.onfinality.io/public-ws",
  },
  {
    name: "HydraDX",
    url: "wss://rpc-01.basilisk.hydradx.io",
  },
];

const basilisk = {
  value: "basilisk",
  name: "Basilisk",
  icon: "basilisk.svg",
  identity: "basilisk",
  symbol: "BSX",
  decimals: 12,
  hasElections: true,
  ss58Format: 10041,
  endpoints: DEFAULT_BASILISK_NODES,
  group: OptionGroups.KusamaAndParachains,
};

export default basilisk;
