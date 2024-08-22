import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export function useAssetsTransfersHistoryAmountColumn() {
  return {
    name: "Amount",
    style: { textAlign: "right", width: "160px", minWidth: "160px" },
    render: (item) => (
      <span key="amount" className="text14Medium text-textPrimary">
        <ValueDisplay
          value={toPrecision(item?.balance, item?.decimals)}
          symbol={item?.symbol}
        />
      </span>
    ),
  };
}
