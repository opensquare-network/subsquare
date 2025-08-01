import React from "react";
import { useForeignAssetIcon } from "next-common/components/assets/known";
import { cn } from "next-common/utils";

function Token({ assetId, symbol, name }) {
  const AssetIcon = useForeignAssetIcon(assetId);

  return (
    <div
      className={cn(
        "flex items-center gap-[8px]",
        "max-sm:flex-col items-start",
      )}
    >
      <div className="flex gap-[8px] items-center text14Medium text-textPrimary max-sm:justify-start">
        <AssetIcon width={24} height={24} />
        <span className="text-textPrimary w-20 max-sm:w-auto">{symbol}</span>
      </div>
      <span className="text-textTertiary">{name}</span>
    </div>
  );
}

export const colToken = {
  name: "Token",
  style: { textAlign: "left", minWidth: "352px" },
  render: (item) => (
    <Token assetId={item.assetId} symbol={item.symbol} name={item.name} />
  ),
};
