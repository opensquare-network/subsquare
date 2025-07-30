import React from "react";
import { useForeignAssets } from "next-common/context/foreignAssets";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoData from "next-common/components/noData";
import useSubForeignAsset from "next-common/hooks/foreignAssets/useSubForeignAsset";

export default function ForeignAssetsTable() {
  const { assets, loading } = useForeignAssets();
  const subAssets = useSubForeignAsset({
    parents: 2,
    interior: {
      x2: [
        {
          globalConsensus: {
            ethereum: {
              chainId: 1,
            },
          },
        },
        {
          accountKey20: {
            network: null,
            key: "0x9d39a5de30e57443bff2a8307a4256c8797a3497",
          },
        },
      ],
    },
  });

  console.log("::::ForeignAssetsTable", assets, loading);
  console.log("::::subsub", subAssets);

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  if (!assets || assets.length === 0) {
    return <NoData text="No foreign assets found" />;
  }

  return (
    <ScrollerX>
      {/* We will build the table structure here in the next steps */}
      <div>Found {assets.length} foreign assets.</div>
    </ScrollerX>
  );
}
