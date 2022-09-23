import Logo from "../../../assets/header-logos/acala.svg";
import DarkModeLogo from "../../../assets/header-logos/acala-dark.svg";
import Avatar from "../../../assets/icons/chain/acala.png";
import MenuGroups from "./menuGroups";

const DEFAULT_ACALA_NODES = [
  {
    name: "OnFinality",
    url: "wss://acala-polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Polkawallet",
    url: "wss://acala.polkawallet.io/",
  },
  {
    name: "Acala Foundation 0",
    url: "wss://acala-rpc-0.aca-api.network/",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://acala-rpc-1.aca-api.network/",
  },
  {
    name: "Acala Foundation 2",
    url: "wss://acala-rpc-2.aca-api.network/ws",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://acala-rpc-3.aca-api.network/ws",
  },
];

const acala = {
  value: "acala",
  name: "Acala",
  icon: "acala.svg",
  identity: "polkadot",
  symbol: "ACA",
  decimals: 12,
  hasElections: false,
  ss58Format: 10,
  snsCoverCid: "bafybeiafirhri4nsnvxm6usej6fcfyrz4hty5jikupag7fufsniamnyauy",
  endpoints: DEFAULT_ACALA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
};

export default acala;
