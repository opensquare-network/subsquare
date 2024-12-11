import dynamic from "next/dynamic";
import Chains from "../chains";
import paseo from "./paseo";

const ProjectIconPaseoAssethub = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoAssethub"),
);

// const NetworkIconPaseoAssetHub = dynamic(() =>
//   import("@osn/icons/subsquare/NetworkPaseoAssethubLight"),
// );

const paseoAssetHub = {
  ...paseo,
  name: "Asset Hub",
  value: Chains.paseoAssetHub,
  avatar: ProjectIconPaseoAssethub,
  darkAvatar: ProjectIconPaseoAssethub,
};

export default paseoAssetHub;
