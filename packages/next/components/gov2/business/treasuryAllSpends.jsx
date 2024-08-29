import dayjs from "dayjs";
import { isNil } from "lodash-es";
import NetworkIcon from "next-common/components/networkIcon";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { cn, estimateBlocksTime, toPrecisionNumber } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { useState } from "react";
import { useSelector } from "react-redux";

export function getTreasuryAllSpendsBusiness(onchain) {
  return [["Request", <AllSpends key="all-spend" onchain={onchain} />]];
}

function AllSpends({ onchain }) {
  const collapseCount = 5;
  const { allSpends = [] } = onchain;
  const [showMore, setShowMore] = useState(false);

  const shouldCollapsed = allSpends?.length > collapseCount;

  return (
    <div className="flex flex-col gap-y-1 w-full">
      {allSpends.map((spend, idx) => (
        <Spend
          key={idx}
          {...spend}
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
  );
}

function Spend({ beneficiary, assetKind, amount, validFrom, className = "" }) {
  const currentChain = useChain();
  let { chain, symbol, type } = assetKind;

  if (type === "assets") {
    chain = Chains.polkadotAssetHub;
  } else if (type === "native") {
    chain = currentChain;
  }
  const { decimals } = getChainSettings(chain);

  return (
    <div
      className={cn(
        "text14Medium flex justify-between items-center",
        className,
      )}
    >
      <div className="flex gap-2 items-center">
        <NetworkIcon chain={chain} className="w-3 h-3" />
        <ValueDisplay
          value={toPrecisionNumber(amount, decimals)}
          symbol={symbol}
        />
        <div className="text-textTertiary">to</div>
        <AddressUser add={beneficiary.address} />
      </div>

      <Time validFrom={validFrom} />
    </div>
  );
}

function Time({ validFrom }) {
  const currentHeight = useSelector(latestHeightSelector);

  let content;
  if (isNil(validFrom)) {
    content = "Immediately";
  } else {
    if (currentHeight > validFrom) {
      content = <PassedTime validFrom={validFrom} />;
    } else {
      content = <FutureTime validFrom={validFrom} />;
    }
  }

  return <div className="text-textTertiary">{content}</div>;
}

function PassedTime({ validFrom }) {
  const { timestamp } = useBlockTimestamp(validFrom);

  if (!timestamp) {
    return null;
  }

  return dayjs(timestamp).format("YYYY-MM-DD");
}

function FutureTime({ validFrom }) {
  const currentHeight = useSelector(latestHeightSelector);
  const { blockTime } = useChainSettings();

  const timeStr = estimateBlocksTime(validFrom - currentHeight, blockTime);
  return <>in {timeStr.slice(0, 2)}</>;
}
