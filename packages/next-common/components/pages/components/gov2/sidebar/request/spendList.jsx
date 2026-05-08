import TreasurySpendValueDisplay from "next-common/components/gov2/business/treasurySpendValueDisplay";
import AssetIcon from "next-common/components/icons/assetIcon";
import { FormatFiatValue } from "../../business/valueDisplayWithFiatValue";
import { RequestWrapper } from ".";
import { useState } from "react";

const separateNumber = 5;

export function SpendItem({ assetKind, amount, symbol, type, decimals }) {
  symbol = symbol || assetKind?.symbol;
  type = type || assetKind?.type;
  decimals = decimals || assetKind?.decimals;

  return (
    <div className="flex items-center gap-x-2">
      <AssetIcon symbol={symbol} className="w-4 h-4" type={type} />
      <TreasurySpendValueDisplay
        type={type}
        amount={amount}
        symbol={symbol}
        decimals={decimals}
        className="text14Medium text-textPrimary"
        tooltipOtherContent={
          <FormatFiatValue amount={amount} symbol={symbol} />
        }
      />
    </div>
  );
}

export default function SpendList({ spends }) {
  const [showMore, setShowMore] = useState(false);

  if (!spends?.length) {
    return null;
  }

  const shouldCollapsed = spends.length > separateNumber;

  return (
    <RequestWrapper>
      <div className="flex flex-col">
        {spends.slice(0, separateNumber).map((spend, idx) => (
          <SpendItem key={idx} {...spend} />
        ))}

        {showMore &&
          shouldCollapsed &&
          spends
            .slice(separateNumber)
            .map((spend, idx) => <SpendItem key={idx} {...spend} />)}

        {shouldCollapsed && (
          <div className="mt-4">
            <span
              role="button"
              className="text12Medium text-theme500"
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              Show {showMore ? "Less" : "More"}
            </span>
          </div>
        )}
      </div>
    </RequestWrapper>
  );
}
