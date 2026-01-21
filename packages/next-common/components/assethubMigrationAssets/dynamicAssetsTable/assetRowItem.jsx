import React, { useEffect } from "react";
import useAssetAccountBalance from "../useAssetAccountBalance";
import BigNumber from "bignumber.js";
import DataListItem from "next-common/components/dataList/item";

function AssetRow({ asset, address, children, onLoaded }) {
  const { assetId } = asset;
  const { loading, balance, transferrable } = useAssetAccountBalance(
    assetId,
    address,
  );

  const hasBalance = !loading && balance && !new BigNumber(balance).isZero();

  useEffect(() => {
    if (!loading && onLoaded) {
      onLoaded(assetId, hasBalance);
    }
  }, [assetId, loading, hasBalance, onLoaded]);

  // Don't render if still loading or balance is zero
  if (loading || !hasBalance) {
    return null;
  }

  const assetWithBalance = {
    ...asset,
    balance,
    transferrable,
  };

  return children(assetWithBalance);
}

export default function AssetRowItem({
  asset,
  address,
  columnsDef,
  classNames,
  styles,
  onLoaded,
}) {
  return (
    <AssetRow asset={asset} address={address} onLoaded={onLoaded}>
      {(assetWithBalance) => {
        const row = columnsDef.map((col) => col.render(assetWithBalance));
        return (
          <DataListItem
            columns={columnsDef}
            row={row}
            columnClassNames={classNames}
            columnStyles={styles}
          />
        );
      }}
    </AssetRow>
  );
}
