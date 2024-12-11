import { TokenSymbol } from "next-common/components/assets/common/columns";
import { useChain } from "next-common/context/chain";
import { useChainSettings } from "next-common/context/chain";
import { isAssetHubChain } from "next-common/utils/chain";

export function checkIsNativeAsset(chain, isNativeAsset) {
  return isNativeAsset && isAssetHubChain(chain);
}

export function useAssetsTransfersHistoryTokenColumn() {
  const chain = useChain();
  const { symbol } = useChainSettings();
  return {
    name: "Token",
    style: { textAlign: "left", width: "160px", minWidth: "160px" },
    render: (item) => (
      <TokenSymbol
        key="token"
        type={checkIsNativeAsset(chain, item?.isNativeAsset) ? "native" : ""}
        assetId={item.assetId}
        symbol={
          checkIsNativeAsset(chain, item?.isNativeAsset)
            ? symbol
            : item?.metadata?.symbol
        }
      />
    ),
  };
}
