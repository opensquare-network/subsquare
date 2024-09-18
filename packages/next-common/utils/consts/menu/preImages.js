import { MenuPreimages } from "@osn/icons/subsquare";
import Chains from "next-common/utils/consts/chains";
import { mergeChainModules } from "../settings/common/modules";

const preImages = {
  name: "Preimages",
  value: "preimages",
  pathname: "/preimages",
  icon: <MenuPreimages />,
  excludeToChains: [Chains.crust],
  modules: mergeChainModules({
    preimages: false,
  }),
};

export default preImages;
