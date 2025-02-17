import TreasurySpendValueDisplay from "next-common/components/gov2/business/treasurySpendValueDisplay";
import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import AssetIcon from "next-common/components/icons/assetIcon";
import { RequestWrapper } from "components/gov2/sidebar/request";

const separateNumber = 5;

export default function AllSpendsRequest() {
  const onchain = useOnchainData();

  const [showMore, setShowMore] = useState(false);

  if (!onchain?.allSpends?.length) {
    return null;
  }

  const shouldCollapsed = onchain.allSpends?.length > separateNumber;

  return (
    <RequestWrapper>
      <div className="flex flex-col">
        {onchain?.allSpends?.slice(0, separateNumber).map?.((spend, idx) => (
          <Spend key={idx} {...spend} />
        ))}

        {showMore &&
          shouldCollapsed &&
          onchain?.allSpends
            .slice(separateNumber)
            .map((spend, idx) => <Spend key={idx} {...spend} />)}

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

function Spend({ assetKind, amount, symbol, type }) {
  symbol = symbol || assetKind?.symbol;
  type = type || assetKind?.type;

  return (
    <div className="flex items-center gap-x-2">
      <AssetIcon symbol={symbol} className="w-4 h-4" type={type} />
      <TreasurySpendValueDisplay
        type={type}
        amount={amount}
        symbol={symbol}
        className="text14Medium text-textPrimary"
      />
    </div>
  );
}
