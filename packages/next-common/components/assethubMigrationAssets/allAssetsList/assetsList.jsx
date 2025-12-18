import React from "react";
import { isNil } from "lodash-es";
import { useWindowWidthContext } from "next-common/context/windowSize";
import MobileAssetsList from "./mobileAssetsList";
import PCAssetsList from "./pcAssetList";

export default function AssetsList({ assets }) {
  const width = useWindowWidthContext();

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <PCAssetsList assets={assets} /> // desktop view
  ) : (
    <MobileAssetsList assets={assets} /> // mobile view
  );
}
