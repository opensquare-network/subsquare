import dayjs from "dayjs";
import { isNil } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { cn, estimateBlocksTime } from "next-common/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import TreasurySpendValueDisplay from "./treasurySpendValueDisplay";
import { useNavCollapsed } from "next-common/context/nav";
import AssetIcon from "next-common/components/icons/assetIcon";

const seperateNumber = 5;

export function getTreasuryAllSpendsBusiness(onchain) {
  return [["Request", <AllSpends key="all-spend" onchain={onchain} />]];
}

function AllSpends({ onchain }) {
  const { allSpends = [] } = onchain;
  const [showMore, setShowMore] = useState(false);

  const shouldCollapsed = allSpends?.length > seperateNumber;

  return (
    <div className="flex flex-col gap-y-1 w-full">
      {allSpends.slice(0, seperateNumber).map((spend, idx) => (
        <Spend key={idx} {...spend} />
      ))}

      {showMore &&
        shouldCollapsed &&
        allSpends
          .slice(seperateNumber)
          .map((spend, idx) => <Spend key={idx} {...spend} />)}

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
  const { chain, symbol, type } = assetKind;
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "text14Medium flex gap-x-2 items-center",
        navCollapsed ? "max-sm:block" : "max-md:block",
        className,
      )}
    >
      <div className="flex items-center gap-x-2">
        <AssetIcon symbol={symbol} className="w-4 h-4" />
        <TreasurySpendValueDisplay
          className="flex gap-x-2 items-center text14Medium"
          chain={chain}
          amount={amount}
          symbol={symbol}
          type={type}
        />
      </div>

      <div className="flex items-center grow">
        <div className={cn("grow flex items-center justify-start gap-x-1")}>
          <div className="text-textTertiary">to</div>
          <AddressUser add={beneficiary.address} />
        </div>

        <Time validFrom={validFrom} />
      </div>
    </div>
  );
}

function Time({ validFrom, className = "" }) {
  const currentHeight = useSelector(latestHeightSelector);

  let content;
  if (isNil(validFrom)) {
    content = "immediately";
  } else {
    if (currentHeight > validFrom) {
      content = <PassedTime validFrom={validFrom} />;
    } else {
      content = <FutureTime validFrom={validFrom} />;
    }
  }

  return <div className={cn("text-textTertiary", className)}>{content}</div>;
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
