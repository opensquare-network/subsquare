import ForeignAssetTransferButton from "next-common/components/assets/foreignAssets/table/transfer";

function Transfer({ item }) {
  const { transferable, decimals, symbol, location } = item;

  return (
    <ForeignAssetTransferButton
      asset={{ transferable, decimals, symbol, location }}
    />
  );
}

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => <Transfer key={item.assetId} item={item} />,
};
