import React from "react";
import { useKnownForeignAssetIcon } from "next-common/components/assets/known";
import { cn } from "next-common/utils";
import ForeignAssetLink from "next-common/components/assets/foreignAssets/table/foreignAssetLink";

function Token({ assetId, symbol, name }) {
  const AssetIcon = useKnownForeignAssetIcon(assetId);

  return (
    <ForeignAssetLink assetId={assetId} className="block group">
      <div
        className={cn(
          "flex items-center gap-[8px]",
          "max-sm:flex-col items-start",
        )}
      >
        <div className="flex gap-[8px] items-center text14Medium text-textPrimary max-sm:justify-start">
          <AssetIcon width={24} height={24} />
          <span className="text-textPrimary group-hover:text-theme500 w-20 max-sm:w-auto transition-colors">
            {symbol || "--"}
          </span>
        </div>
        <span className="text-textTertiary">{name || "--"}</span>
      </div>
    </ForeignAssetLink>
  );
}

export const colToken = {
  name: "Token",
  style: { textAlign: "left", minWidth: "368px" },
  render: (item) => (
    <Token assetId={item.assetId} symbol={item.symbol} name={item.name} />
  ),
};
