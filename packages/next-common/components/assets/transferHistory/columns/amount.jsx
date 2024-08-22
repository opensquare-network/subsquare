import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { checkIsNativeAsset } from "./token";
import { useChain } from "next-common/context/chain";
import { useChainSettings } from "next-common/context/chain";

export function useAssetsTransfersHistoryAmountColumn() {
  const chain = useChain();
  const { decimals, symbol } = useChainSettings();

  return {
    name: "Amount",
    style: { textAlign: "right", width: "160px", minWidth: "160px" },
    render: (item) => (
      <span key="amount" className="text14Medium text-textPrimary">
        <ValueDisplay
          value={toPrecision(
            item?.balance,
            checkIsNativeAsset(chain, item?.isNativeAsset)
              ? decimals
              : item?.decimals,
          )}
          symbol={
            checkIsNativeAsset(chain, item?.isNativeAsset)
              ? symbol
              : item?.symbol
          }
        />
      </span>
    ),
  };
}
