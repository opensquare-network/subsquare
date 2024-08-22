import { TokenSymbol } from "next-common/components/assets/assetsList";

export function useAssetsTransfersHistoryTokenColumn() {
  return {
    name: "Token",
    style: { textAlign: "left", width: "160px", minWidth: "160px" },
    render: (item) => (
      <TokenSymbol
        key="token"
        type={item.type}
        assetId={item.assetId}
        symbol={item.symbol}
      />
    ),
  };
}
