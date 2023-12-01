import React from "react";
import { MenuPreimages } from "@osn/icons/subsquare";
import Chains from "next-common/utils/consts/chains";

const preImages = {
  name: "Preimages",
  value: "preimages",
  pathname: "/preimages",
  icon: <MenuPreimages />,
  excludeToChains: [Chains.crust],
};

export default preImages;
