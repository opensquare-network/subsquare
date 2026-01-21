import React, { useEffect } from "react";
import useForeignAssetAccountBalance from "../useForeignAssetAccountBalance";
import BigNumber from "bignumber.js";
import DataListItem from "next-common/components/dataList/item";

function ForeignAssetRow({ asset, address, children, onLoaded }) {
  const { assetId } = asset;
  const { loading, balance, transferable } = useForeignAssetAccountBalance(
    asset,
    address,
  );

  const hasBalance = !loading && balance && !new BigNumber(balance).isZero();

  useEffect(() => {
    if (!loading && onLoaded) {
      onLoaded(assetId, hasBalance);
    }
  }, [assetId, loading, hasBalance, onLoaded]);

  if (loading || !hasBalance) {
    return null;
  }

  const assetWithBalance = {
    ...asset,
    balance,
    transferable,
  };

  return children(assetWithBalance);
}

export default function ForeignAssetRowItem({
  asset,
  address,
  columnsDef,
  classNames,
  styles,
  onLoaded,
}) {
  return (
    <ForeignAssetRow asset={asset} address={address} onLoaded={onLoaded}>
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
    </ForeignAssetRow>
  );
}
