import React, { useMemo } from "react";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSingleForeignAsset } from "next-common/context/foreignAssets/singleForeignAsset";

function Transferable({ transferable, decimals }) {
  const { asset, loading } = useSingleForeignAsset();

  const displayTransferable = useMemo(() => {
    if (loading || !asset) {
      return transferable;
    }

    return asset.transferable;
  }, [loading, asset, transferable]);

  return <ValueDisplay value={toPrecision(displayTransferable, decimals)} />;
}

export const colTransferable = {
  name: "Transferable",
  style: { textAlign: "right", minWidth: "140px" },
  render: (item) => (
    <Transferable transferable={item.transferable} decimals={item.decimals} />
  ),
};
