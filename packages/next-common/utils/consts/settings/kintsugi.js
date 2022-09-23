import Logo from "../../../assets/header-logos/kintsugi.svg";
import DarkModeLogo from "../../../assets/header-logos/kintsugi-dark.svg";
import Avatar from "../../../assets/icons/chain/kintsugi.png";
import OptionGroups from "./menuGroups";

const DEFAULT_KINTSUGI_NODES =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true"
    ? [
      {
        name: "Kintsugi Test Endpoint",
        url: "wss://api-dev-kintsugi.interlay.io/parachain",
      },
    ]
    : [
      {
        name: "OnFinality",
        url: "wss://kintsugi.api.onfinality.io/public-ws",
      },
      {
        name: "Kintsugi Labs",
        url: "wss://api-kusama.interlay.io/parachain",
      },
      {
        name: "Dwellir",
        url: "wss://kintsugi-rpc.dwellir.com",
      },
    ];

const kintsugi = {
  value: "kintsugi",
  name: "Kintsugi",
  icon: "kintsugi.png",
  identity: "kusama",
  symbol: "KINT",
  voteSymbol: "vKINT",
  decimals: 12,
  hasElections: false,
  ss58Format: 2092,
  snsCoverCid: "bafybeifddx4p4ouofy2mj3pt5o62alnpfywbu7w7iedws3shpiu547tszi",
  endpoints: DEFAULT_KINTSUGI_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#051433",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: OptionGroups.KusamaAndParachains,
};

export default kintsugi;
