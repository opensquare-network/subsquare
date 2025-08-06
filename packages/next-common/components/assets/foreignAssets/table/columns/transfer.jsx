import ForeignAssetTransferButton from "next-common/components/assets/foreignAssets/table/transfer";
import { useMemo } from "react";
import { useSingleForeignAsset } from "next-common/context/foreignAssets/singleForeignAsset";

function Transfer({ item }) {
  const { asset, loading } = useSingleForeignAsset();
  const { transferable, decimals, symbol, location } = item;

  const displayTransferable = useMemo(() => {
    if (loading || !asset) {
      return transferable;
    }

    return asset.transferable;
  }, [loading, asset, transferable]);

  return (
    <ForeignAssetTransferButton
      asset={{ transferable: displayTransferable, decimals, symbol, location }}
    />
  );
}

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => <Transfer item={item} />,
};
