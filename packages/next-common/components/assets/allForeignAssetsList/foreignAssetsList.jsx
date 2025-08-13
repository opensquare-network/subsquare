import React from "react";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import MobileForeignAssetsList from "./mobileForeignAssetsList";
import PCForeignAssetsList from "./pcForeignAssetsList";

export default function ForeignAssetsList({ assets }) {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <PCForeignAssetsList assets={assets} />
  ) : (
    <MobileForeignAssetsList assets={assets} />
  );
}
