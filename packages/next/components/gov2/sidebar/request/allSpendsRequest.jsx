import TreasurySpendValueDisplay from "components/gov2/business/treasurySpendValueDisplay";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";
import { cn } from "next-common/utils";
import { useState } from "react";
import { RequestWrapper } from ".";

export default function AllSpendsRequest() {
  const onchain = useOnchainData();

  const collapseCount = 5;
  const [showMore, setShowMore] = useState(false);

  if (
    !onchain?.isTreasury &&
    !onchain?.isStableTreasury &&
    isNil(onchain?.value) &&
    !onchain?.allSpends
  ) {
    return null;
  }

  const shouldCollapsed = onchain.allSpends?.length > collapseCount;

  return (
    <RequestWrapper>
      <div className="flex flex-col">
        {onchain?.allSpends?.map?.((spend, idx) => (
          <Spend
            key={idx}
            assetKind={spend.assetKind}
            amount={spend.amount}
            className={cn(
              shouldCollapsed && !showMore && idx >= collapseCount && "hidden",
            )}
          />
        ))}

        {shouldCollapsed && (
          <div>
            <span
              role="button"
              className="mt-4 text12Medium text-theme500"
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

function Spend({ assetKind, amount, className }) {
  const { chain, symbol, type } = assetKind;

  return (
    <TreasurySpendValueDisplay
      className={cn("flex ", className)}
      chain={chain}
      type={type}
      amount={amount}
      symbol={symbol}
    />
  );
}
