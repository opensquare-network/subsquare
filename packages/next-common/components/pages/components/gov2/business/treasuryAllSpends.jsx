import dayjs from "dayjs";
import { isNil } from "lodash-es";
import AssetIcon from "next-common/components/icons/assetIcon";
import Tooltip from "next-common/components/tooltip";
import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";
import { useNavCollapsed } from "next-common/context/nav";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { cn } from "next-common/utils";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import { useState } from "react";
import TreasurySpendValueDisplay from "next-common/components/gov2/business/treasurySpendValueDisplay";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import FieldLoading from "next-common/components/icons/fieldLoading";
import useChainOrScanHeight from "next-common/hooks/height";
import BeneficiaryDetailButton from "./beneficiaryDetailButton";
import useTokenFiatValue from "next-common/hooks/balance/useTokenFiatValue";

const separateNumber = 5;

export function getTreasuryAllSpendsBusiness(onchain) {
  if (!onchain?.allSpends?.length) {
    return null;
  }

  return [["Request", <AllSpends key="all-spend" onchain={onchain} />]];
}

function AllSpends({ onchain }) {
  const { allSpends = [] } = onchain;
  const [showMore, setShowMore] = useState(false);
  const [navCollapsed] = useNavCollapsed();

  const shouldCollapsed = allSpends?.length > separateNumber;

  return (
    <div
      className={cn(
        "flex flex-col gap-y-1 w-full",
        navCollapsed ? "max-md:gap-y-2" : "max-sm:gap-y-2",
      )}
    >
      {allSpends.slice(0, separateNumber).map((spend, idx) => (
        <Spend key={idx} {...spend} />
      ))}

      {showMore &&
        shouldCollapsed &&
        allSpends
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
  );
}

function SpendBeneficiary({ beneficiary, beneficiaryLocation }) {
  if (!beneficiary && !beneficiaryLocation) {
    return null;
  }

  return (
    <>
      <div className="text-textTertiary">to</div>
      <div className={cn("grow flex")}>
        {beneficiary ? (
          <AddressUser add={beneficiary} maxWidth={176} />
        ) : (
          <BeneficiaryDetailButton beneficiaryLocation={beneficiaryLocation} />
        )}
      </div>
    </>
  );
}

function Spend({
  beneficiary,
  beneficiaryLocation,
  assetKind,
  amount,
  validFrom,
  after,
  symbol,
  type,
  className = "",
} = {}) {
  symbol = symbol || assetKind?.symbol;
  type = type || assetKind?.type;

  beneficiary =
    typeof beneficiary === "string" ? beneficiary : beneficiary?.address;

  const [navCollapsed] = useNavCollapsed();
  const valueFiatPrice = useTokenFiatValue(amount, symbol);
  const formattedFiatValue = valueFiatPrice && `( ≈ $${valueFiatPrice} )`;

  return (
    <div
      className={cn(
        "text14Medium flex gap-x-2 items-center justify-between",
        navCollapsed ? "max-sm:block" : "max-md:block",
        className,
      )}
    >
      <div className="flex items-center gap-x-2">
        <AssetIcon symbol={symbol} className="w-4 h-4" type={type} />
        <TreasurySpendValueDisplay
          className="flex gap-x-2 items-center text14Medium"
          amount={amount}
          symbol={symbol}
          type={type}
          tooltipOtherContent={formattedFiatValue}
        />
        <SpendBeneficiary
          beneficiary={beneficiary}
          beneficiaryLocation={beneficiaryLocation}
        />
      </div>

      {!isNil(validFrom) ? (
        <Time validFrom={validFrom} />
      ) : (
        <After after={after} />
      )}
    </div>
  );
}

function Time({ validFrom, className = "" }) {
  const currentHeight = useChainOrScanHeight();

  let content;
  let tooltipContent;
  if (isNil(validFrom)) {
    content = "immediately";
    tooltipContent = "Can be claimed immediately after approval";
  } else {
    if (currentHeight > validFrom) {
      content = <PassedTime validFrom={validFrom} />;
    } else {
      content = <FutureTime validFrom={validFrom} />;
    }
    tooltipContent = `Block #${validFrom?.toLocaleString?.()}`;
  }

  return (
    <Tooltip
      content={tooltipContent}
      className={cn("text-textTertiary", className)}
    >
      {content}
    </Tooltip>
  );
}

function After({ after, className = "" }) {
  const votingFinishHeight = useReferendumVotingFinishHeight();
  if (!isNil(votingFinishHeight) && after > 0) {
    return (
      <Time validFrom={votingFinishHeight + after} className={className} />
    );
  }

  let content;
  let tooltipContent;
  if (isNil(after) || after === 0) {
    content = "immediately";
    tooltipContent = "Can be claimed immediately after approval";
  } else {
    content = <AfterTime after={after} futurePrefix="after" />;
    tooltipContent = `After ${after} blocks`;
  }

  return (
    <Tooltip
      content={tooltipContent}
      className={cn("text-textTertiary", className)}
    >
      {content}
    </Tooltip>
  );
}

function PassedTime({ validFrom }) {
  const { timestamp } = useBlockTimestamp(validFrom);

  if (isNaN(timestamp)) {
    return null;
  }

  return dayjs(timestamp).format("YYYY-MM-DD");
}

function FutureTime({ validFrom }) {
  const currentHeight = useChainOrScanHeight();
  if (isNaN(currentHeight)) {
    return <FieldLoading size={14} />;
  }
  return <AfterTime after={validFrom - currentHeight} />;
}

function AfterTime({ after, futurePrefix }) {
  const { blockTime } = useChainSettings();
  return formatTimeAgo(dayjs().add(after * blockTime), {
    futurePrefix,
    slice: 2,
  });
}
