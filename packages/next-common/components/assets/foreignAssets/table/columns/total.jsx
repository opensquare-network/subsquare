import React, { useMemo } from "react";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSingleForeignAsset } from "next-common/context/foreignAssets/singleForeignAsset";

function Total({ balance, decimals }) {
  const { asset, loading } = useSingleForeignAsset();

  const displayBalance = useMemo(() => {
    if (loading || !asset) {
      return balance;
    }

    return asset.balance;
  }, [loading, asset, balance]);

  return <ValueDisplay value={toPrecision(displayBalance, decimals)} />;
}

export const colTotal = {
  name: "Total",
  style: { textAlign: "right", width: "160px" },
  render: (item) => <Total balance={item.balance} decimals={item.decimals} />,
};
