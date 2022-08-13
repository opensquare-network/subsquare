import Logo from "../../../assets/header-logos/centrifuge.svg";
import DarkModeLogo from "../../../assets/header-logos/centrifuge-dark.svg";
import Avatar from "../../../assets/icons/chain/centrifuge.png";
import DarkAvatar from "../../../assets/icons/chain/centrifuge-dark.png";

import Chains from "../chains";
import capitalize from "../../capitalize";

const name = Chains.centrifuge;

export const defaultNodes = [
  {
    name: "OnFinality",
    url: "wss://centrifuge-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Centrifuge",
    url: "wss://fullnode.parachain.centrifuge.io",
  },
  {
    name: "Dwellir",
    url: "wss://centrifuge-rpc.dwellir.com",
  },
];

const centrifuge = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "CFG",
  decimals: 18,
  hasElections: true,
  ss58Format: 36,
  snsCoverCid: "bafybeigik7gv4e2tasibkgjhvlfyjzdlbw4p33x6o64jhdypmgqhmo3a54",
  endpoints: defaultNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
};

export default centrifuge;
