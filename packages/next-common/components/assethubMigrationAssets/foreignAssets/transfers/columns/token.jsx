import React from "react";
import { useKnownForeignAssetIcon } from "next-common/components/assethubMigrationAssets/known";
import { cn } from "next-common/utils";
import { ForeignAssetLink } from "next-common/components/assethubMigrationAssets/assetLink";

function Token({ assetId, symbol }) {
  const AssetIcon = useKnownForeignAssetIcon(assetId);

  return (
    <div
      className={cn(
        "flex items-center gap-[8px]",
        "max-sm:flex-col items-start",
      )}
    >
      <div className="flex gap-[8px] items-center text14Medium text-textPrimary max-sm:justify-start">
        {/* eslint-disable-next-line react-hooks/static-components */}
        <AssetIcon width={24} height={24} />
        <ForeignAssetLink
          assetId={assetId}
          className="text-textPrimary w-20 max-sm:w-auto"
        >
          {symbol || "--"}
        </ForeignAssetLink>
      </div>
    </div>
  );
}

export const colToken = {
  name: "Token",
  style: { textAlign: "left", width: "160px", minWidth: "160px" },
  render: (item) => (
    <Token assetId={item.assetId} symbol={item.metadata.symbol} />
  ),
};
