import { useState } from "react";
import { isNil } from "lodash-es";
import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import CountDown from "next-common/components/_CountDown";
import DataList from "next-common/components/dataList";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  ActiveTag,
  NegativeTag,
  WarningTag,
} from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import { useChainSettings } from "next-common/context/chain";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { getNextPayoutCountdown, getPayoutActionLabel } from "./chainData";
import useDemoLatestHeight from "./demoHeight";
import { usePayoutQueueIsDemo } from "./sourceContext";

const PayoutActionPopup = dynamicPopup(() => import("./actionPopup"));

const statusConfig = {
  Pending: {
    Tag: ActiveTag,
    tooltip: "Eligible for payout, waiting to be submitted",
  },
  Attempted: {
    Tag: WarningTag,
    tooltip:
      "A payout has been submitted and is waiting to be confirmed by check_status",
  },
  Failed: {
    Tag: NegativeTag,
    tooltip: "The last payout attempt failed, the spend can be paid again",
  },
};

function PayoutStatusTag({ status }) {
  const { Tag, tooltip } = statusConfig[status] ?? {};
  if (!Tag) {
    return null;
  }

  return (
    <Tooltip className="flex items-center" content={tooltip}>
      <Tag>{status}</Tag>
    </Tooltip>
  );
}

function PayoutActionButton({ spend, symbol }) {
  const [showPopup, setShowPopup] = useState(false);
  const label = getPayoutActionLabel(spend?.status);
  if (!label) {
    return null;
  }

  return (
    <>
      <PrimaryButton
        type="button"
        size="small"
        onClick={() => setShowPopup(true)}
      >
        {label}
      </PrimaryButton>
      {showPopup && (
        <PayoutActionPopup
          spend={spend}
          symbol={symbol}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

function NextPayoutBox({ spend, symbol, countdown, countdownText }) {
  return (
    <div role="listitem" className="py-4">
      <div className="flex flex-col gap-3 rounded-xl border border-theme500 bg-theme100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text12Bold tracking-wide text-theme500">
              NEXT PAYOUT
            </span>
            <PayoutStatusTag status={spend.status} />
          </div>
          <div className="flex items-center gap-2">
            {countdown && countdownText && (
              <Tooltip className="flex items-center" content={countdownText}>
                <CountDown
                  size={20}
                  width={5}
                  numerator={Math.max(0, countdown.elapsed ?? 0)}
                  denominator={Math.max(1, countdown.total ?? 1)}
                  backgroundColor="var(--neutral300)"
                  foregroundColor="var(--theme500)"
                />
              </Tooltip>
            )}
            <PayoutActionButton spend={spend} symbol={symbol} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/treasury/spends/${spend.index}`}
            className="shrink-0 cursor-pointer text14Bold text-textPrimary hover:underline"
          >
            #{spend.index}
          </Link>
          <span className="shrink-0 text-textTertiary">·</span>
          <div className="min-w-0 flex-1">
            <Tooltip className="block w-fit max-w-full" content={spend.title}>
              <Link
                href={`/treasury/spends/${spend.index}`}
                className="block truncate text14Bold text-textPrimary hover:underline"
              >
                {spend.title}
              </Link>
            </Tooltip>
          </div>
          <span className="shrink-0 text14Medium">
            {isNil(spend.amount) ? (
              <span>-</span>
            ) : (
              <ValueDisplay value={spend.amount} symbol={symbol} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function NextPayoutRow({ spend, symbol }) {
  // The clock lives in this row only, so its ticks never remount the table rows
  const isDemo = usePayoutQueueIsDemo();
  const demoHeight = useDemoLatestHeight(isDemo);
  const chainHeight = useAhmLatestHeight();
  const { blockTime } = useChainSettings();

  const countdown = getNextPayoutCountdown({
    validFrom: spend.validFrom,
    orderKey: spend.orderKey,
    expireAt: spend.expireAt,
    orderExpirationPeriod: spend.orderExpirationPeriod,
    latestHeight: isDemo ? demoHeight : chainHeight,
    blockTime,
  });

  if (!countdown) {
    return <NextPayoutBox spend={spend} symbol={symbol} />;
  }

  const isMature = countdown.mode !== "maturity";
  const remaining = Math.max(0, countdown.remainingMs ?? 0);
  const total = Math.max(1, countdown.totalMs ?? 1);

  const countdownText = `${
    isMature ? "Sort lease expires in" : "Payable in"
  } ${formatTimeDuration(remaining)}`;

  return (
    <NextPayoutBox
      spend={spend}
      symbol={symbol}
      countdown={{ elapsed: total - remaining, total }}
      countdownText={countdownText}
    />
  );
}

const waitingColumns = [
  {
    name: "#",
    style: { textAlign: "left", width: "80px", minWidth: "80px" },
  },
  { name: "Title", className: "min-w-0 pr-4" },
  {
    name: "Amount",
    style: { textAlign: "right", width: "140px", minWidth: "140px" },
  },
];

function WaitingQueue({ queue }) {
  const waitingRows = queue.queue.map((spend) => {
    const row = [
      <Link
        key="index"
        href={`/treasury/spends/${spend.index}`}
        className="cursor-pointer text14Medium text-textPrimary hover:underline"
      >
        #{spend.index}
      </Link>,
      <Tooltip
        key="title"
        className="block w-fit max-w-full"
        content={spend.title}
      >
        <Link
          href={`/treasury/spends/${spend.index}`}
          className="block truncate text14Medium text-textPrimary hover:underline"
        >
          {spend.title}
        </Link>
      </Tooltip>,
      isNil(spend.amount) ? (
        <span key="amount">-</span>
      ) : (
        <ValueDisplay key="amount" value={spend.amount} symbol={queue.symbol} />
      ),
    ];
    row.key = spend.index;
    return row;
  });
  const rows = queue.nextPayout
    ? [queue.nextPayout, ...waitingRows]
    : waitingRows;

  return (
    <DataList
      columns={waitingColumns}
      rows={rows}
      noDataText="No spends waiting in this queue"
      renderItem={(Item, idx, rowList) =>
        queue.nextPayout && idx === 0 ? (
          <NextPayoutRow
            key="next-payout"
            spend={queue.nextPayout}
            symbol={queue.symbol}
          />
        ) : (
          <Item key={idx} row={rowList[idx]} />
        )
      }
    />
  );
}

export default function PayoutQueueCard({ queue }) {
  return (
    <div className="flex flex-col gap-4">
      <SecondaryCard>
        <SummaryLayout>
          <SummaryItem
            title={
              <span className="flex items-center gap-1">
                Queued
                {!isNil(queue.capacity) && (
                  <Tooltip
                    content={`Max queued spends for this asset kind is ${queue.capacity}. The waiting queue excludes the current Next Payout`}
                  />
                )}
              </span>
            }
          >
            {queue.queue.length}
            {!isNil(queue.capacity) && (
              <span className="total">/ {queue.capacity}</span>
            )}
          </SummaryItem>
          <SummaryItem title="Treasury Balance">
            {isNil(queue.treasuryBalance) ? (
              <span>-</span>
            ) : (
              <ValueDisplay
                value={queue.treasuryBalance}
                symbol={queue.symbol}
              />
            )}
          </SummaryItem>
          <SummaryItem title="To Be Paid">
            {isNil(queue.toBePaid) ? (
              <span>-</span>
            ) : (
              <ValueDisplay value={queue.toBePaid} symbol={queue.symbol} />
            )}
          </SummaryItem>
        </SummaryLayout>
      </SecondaryCard>

      <TitleContainer className="justify-start">
        <span className="flex items-center gap-1">
          Queue
          <Tooltip content="Spends are paid in order, one at a time." />
        </span>
      </TitleContainer>
      <SecondaryCard>
        <WaitingQueue queue={queue} />
      </SecondaryCard>
    </div>
  );
}
