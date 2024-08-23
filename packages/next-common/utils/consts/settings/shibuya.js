import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";
import astarSettings from "./astar";

const ProjectIconShibuyaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconShibuyaDark"),
);
const ProjectIconShibuyaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconShibuyaLight"),
);
const ProjectLogoShibuyaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoShibuyaDark"),
);
const ProjectLogoShibuyaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoShibuyaLight"),
);

const nodes = [
  {
    name: "Astar",
    url: "wss://rpc.shibuya.astar.network",
  },
  {
    name: "Dwellir",
    url: "wss://shibuya-rpc.dwellir.com",
  },
];

const shibuya = {
  ...astarSettings,
  value: Chains.shibuya,
  name: capitalize(Chains.shibuya),
  identity: Chains.shibuya,
  symbol: "SBY",
  endpoints: nodes,
  avatar: ProjectIconShibuyaLight,
  darkAvatar: ProjectIconShibuyaDark,
  navLogo: ProjectLogoShibuyaLight,
  navLogoDark: ProjectLogoShibuyaDark,
  group: MenuGroups.Solochain,
  description: "Shibuya is the testnet of Shiden (a sister chain of Astar).",
};

export default shibuya;
