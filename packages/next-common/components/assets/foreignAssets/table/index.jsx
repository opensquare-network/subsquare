import React from "react";
import { useForeignAssets } from "next-common/context/foreignAssets";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoData from "next-common/components/noData";
// import useSubForeignAsset from "next-common/hooks/foreignAssets/useSubForeignAsset";

// TODO: ForeignAssetsTable
export default function ForeignAssetsTable() {
  const { assets, loading } = useForeignAssets();
  // const subAssets = useSubForeignAsset();
  console.log("::::ForeignAssetsTable", assets, loading);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!assets || assets.length === 0) {
    return <NoData text="No foreign assets found" />;
  }

  return (
    <ScrollerX>
      <div>ForeignAssetsTable</div>
    </ScrollerX>
  );
}
