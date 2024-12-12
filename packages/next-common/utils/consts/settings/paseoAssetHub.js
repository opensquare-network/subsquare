import dynamic from "next/dynamic";
import Chains from "../chains";
import paseo from "./paseo";

const ProjectIconPaseoAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoAssethub"),
);

const NetworkIconPaseoAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/NetworkPaseoAssethubLight"),
);

const endpoints = [
  {
    name: "IBP1",
    url: "wss://sys.ibp.network/asset-hub-paseo",
  },
  {
    name: "IBP2",
    url: "wss://asset-hub-paseo.dotters.network",
  },
  {
    name: "Dwellir",
    url: "wss://asset-hub-paseo-rpc.dwellir.com",
  },
  {
    name: "StakeWorld",
    url: "wss://pas-rpc.stakeworld.io/assethub",
  },
  {
    name: "TurboFlakes",
    url: "wss://sys.turboflakes.io/asset-hub-paseo",
  },
];

const paseoAssetHub = {
  ...paseo,
  value: Chains.paseoAssetHub,
  name: "Asset Hub",
  description:
    "System parachain on Paseo network for creating and sending tokens and NFTs.",
  avatar: ProjectIconPaseoAssetHub,
  darkAvatar: NetworkIconPaseoAssetHub,
  endpoints,
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "assethub-paseo",
    },
  },
};

export default paseoAssetHub;
