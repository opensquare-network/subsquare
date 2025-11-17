import React from "react";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import MobileAssetsList from "./mobileAssetsList";
import PCAssetsList from "./pcAssetList";

export default function AssetsList({ assets }) {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <PCAssetsList assets={assets} /> // desktop view
  ) : (
    <MobileAssetsList assets={assets} /> // mobile view
  );
}
