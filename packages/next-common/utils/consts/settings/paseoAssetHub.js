import dynamic from "next/dynamic";
import Chains from "../chains";
import {
  paseoLinks,
  paseoThemeVars,
  paseoCommonSettings,
  paseoAssethubMigration,
  paseoAssetHubNodes,
} from "./common/paseo";

const ProjectIconPaseoAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoAssethub"),
);

const NetworkIconPaseoAssetHub = dynamic(() =>
  import("@osn/icons/subsquare/NetworkPaseoAssethubLight"),
);

const paseoAssetHub = {
  ...paseoCommonSettings,
  value: Chains.paseoAssetHub,
  name: "Asset Hub",
  blockTime: 6000,
  assethubMigration: paseoAssethubMigration,
  description:
    "System parachain on Paseo network for creating and sending tokens and NFTs.",
  avatar: ProjectIconPaseoAssetHub,
  darkAvatar: NetworkIconPaseoAssetHub,
  links: paseoLinks,
  ...paseoThemeVars,
  endpoints: paseoAssetHubNodes,
  noScan: true,
  integrations: {
    statescan: true,
    subscan: {
      domain: "assethub-paseo",
    },
  },
  allowWeb2Login: true,
};

export default paseoAssetHub;
