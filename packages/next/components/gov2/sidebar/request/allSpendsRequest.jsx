import { isNil } from "lodash-es";
import NetworkIcon from "next-common/components/networkIcon";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { cn, toPrecision } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { RequestWrapper } from ".";
import { useState } from "react";

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
  const currentChain = useChain();
  let { chain, symbol, type } = assetKind;

  if (type === "assets") {
    chain = Chains.polkadotAssetHub;
  } else if (type === "native") {
    chain = currentChain;
  }
  const { decimals } = getChainSettings(chain);

  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <NetworkIcon chain={chain} className="w-3 h-3" />

      <ValueDisplay
        className="text14Medium"
        value={toPrecision(amount, decimals)}
        symbol={symbol}
      />
    </div>
  );
}
