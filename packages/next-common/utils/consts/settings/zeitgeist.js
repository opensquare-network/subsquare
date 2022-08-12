import Chains from "../chains";
import capitalize from "../../capitalize";

const defaultNodes = [
  {
    name: "OnFinality",
    url: "wss://zeitgeist.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://zeitgeist-rpc.dwellir.com",
  },
  {
    name: "ZeitgeistPM",
    url: "wss://rpc-0.zeitgeist.pm",
  },
];

const zeitgeist = {
  value: Chains.zeitgeist,
  name: capitalize(Chains.zeitgeist),
  icon: "zeitgeist.svg",
  identity: Chains.zeitgeist,
  symbol: "ZTG",
  decimals: 10,
  hasElections: false,
  ss58Format: 73,
  blockTime: 12000,
  snsCoverCid: "bafybeifwpcjcbym2df3zuh63p4nowvh53d6hgludiwvlsnusxckyke5sri",
  loginButtonPrimary: true,
  endpoints: defaultNodes,
  headerBackgroundColor: "#000000",
};

export default zeitgeist;
