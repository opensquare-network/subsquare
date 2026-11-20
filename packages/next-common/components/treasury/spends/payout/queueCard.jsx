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
import {
  getNextPayoutAction,
  getNextPayoutCountdown,
  getPayoutAction,
  getPayoutActionHint,
  isPayoutBalanceInsufficient,
} from "./chainData";

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

function PayoutActionButton({
  spend,
  symbol,
  action,
  hint,
  blocked,
  blockedHint,
}) {
  // Freeze the spend and action the user confirmed: the head can change while
  // the popup is open, and the submitted call must stay the one that was shown.
  const [opened, setOpened] = useState(null);

  // No action while the head is not payable yet, the countdown shows the wait
  if (!action?.call) {
    return null;
  }

  // A payout above the treasury balance would revert, so it cannot be opened.
  if (blocked) {
    return (
      <Tooltip className="flex items-center" content={blockedHint}>
        <PrimaryButton type="button" size="small" disabled>
          {action.label}
        </PrimaryButton>
      </Tooltip>
    );
  }

  const button = (
    <PrimaryButton
      type="button"
      size="small"
      onClick={() => setOpened({ spend, action })}
    >
      {action.label}
    </PrimaryButton>
  );

  return (
    <>
      {hint ? (
        <Tooltip className="flex items-center" content={hint}>
          {button}
        </Tooltip>
      ) : (
        button
      )}
      {!!opened && (
        <PayoutActionPopup
          spend={opened.spend}
          symbol={symbol}
          action={opened.action}
          onClose={() => setOpened(null)}
        />
      )}
    </>
  );
}

function NextPayoutBox({
  spend,
  symbol,
  action,
  blocked,
  countdown,
  countdownText,
  latestHeight,
  blockTime,
}) {
  const hint = getPayoutActionHint({
    action,
    isHead: true,
    inOrder: true,
    validFrom: spend.validFrom,
    spendExpireAt: spend.spendExpireAt,
    latestHeight,
    blockTime,
  });

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
            {!countdown && countdownText && (
              <span className="text12Medium text-textTertiary">
                {countdownText}
              </span>
            )}
            <PayoutActionButton
              spend={spend}
              symbol={symbol}
              action={action}
              hint={hint}
              blocked={blocked}
              blockedHint="The treasury balance is lower than this payout, so the call would fail. Top up the treasury first."
            />
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

function NextPayoutRow({
  spend,
  symbol,
  firstQueuedOrderKey,
  latestHeight,
  treasuryBalance,
}) {
  const { blockTime } = useChainSettings();

  const action = getNextPayoutAction({
    status: spend.status,
    validFrom: spend.validFrom,
    expireAt: spend.expireAt,
    spendExpireAt: spend.spendExpireAt,
    firstQueuedOrderKey,
    latestHeight,
  });

  const countdown = getNextPayoutCountdown({
    validFrom: spend.validFrom,
    orderKey: spend.orderKey,
    expireAt: spend.expireAt,
    orderExpirationPeriod: spend.orderExpirationPeriod,
    latestHeight,
    blockTime,
  });

  // A payout above the treasury balance reverts with `PayoutError`; rotating or
  // checking the status does not need funds and stays available.
  const insufficientBalance =
    action?.kind === "payout" &&
    isPayoutBalanceInsufficient(treasuryBalance, spend.amount);

  if (!countdown) {
    return (
      <NextPayoutBox
        spend={spend}
        symbol={symbol}
        action={action}
        blocked={insufficientBalance}
        latestHeight={latestHeight}
        blockTime={blockTime}
      />
    );
  }

  const isMature = countdown.mode !== "maturity";
  const leaseExpired = isMature && (countdown.remainingBlocks ?? 0) <= 0;
  const remaining = Math.max(0, countdown.remainingMs ?? 0);
  const total = Math.max(1, countdown.totalMs ?? 1);

  const countdownText = spend.expired
    ? "Payout window expired"
    : leaseExpired
    ? "Payout order expired"
    : `${
        isMature ? "Payout order expires in" : "Payable in"
      } ${formatTimeDuration(remaining)}`;

  return (
    <NextPayoutBox
      spend={spend}
      symbol={symbol}
      action={action}
      blocked={insufficientBalance}
      countdown={
        spend.expired || leaseExpired
          ? null
          : { elapsed: total - remaining, total }
      }
      countdownText={countdownText}
      latestHeight={latestHeight}
      blockTime={blockTime}
    />
  );
}

// A queued spend can be not yet mature: the queue is ordered by
// `max(approval block, valid_from)` and includes spends that are payable later
function SpendMaturity({ spend, latestHeight, blockTime }) {
  if (spend.expired) {
    return (
      <Tooltip content="Payout window closed; check status to remove it.">
        <span className="text-textTertiary">Expired</span>
      </Tooltip>
    );
  }

  const orderKey = spend.orderKey;
  if (isNil(orderKey) || isNil(latestHeight)) {
    return <span className="text-textTertiary">-</span>;
  }

  const remainingBlocks = Number(orderKey) - Number(latestHeight);
  if (remainingBlocks <= 0) {
    return (
      <Tooltip content="Payable once it reaches the queue head.">
        <span className="text-textSecondary">Mature</span>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={`Mature at #${Number(orderKey).toLocaleString()}`}>
      <span className="text-textTertiary">
        {formatTimeDuration(remainingBlocks * (Number(blockTime) || 0))}
      </span>
    </Tooltip>
  );
}

const waitingColumns = [
  {
    name: "#",
    style: { textAlign: "left", width: "80px", minWidth: "80px" },
  },
  { name: "Title", className: "min-w-0 pr-4" },
  {
    name: "Maturity",
    style: { textAlign: "right", width: "120px", minWidth: "120px" },
  },
  {
    name: "Amount",
    style: { textAlign: "right", width: "140px", minWidth: "140px" },
  },
  {
    name: "Action",
    style: { textAlign: "right", width: "120px", minWidth: "120px" },
  },
];

function WaitingQueue({ queue, latestHeight }) {
  const { blockTime } = useChainSettings();

  const waitingRows = queue.queue.map((spend) => {
    // An expired or stranded queued spend still needs a permissionless
    // `check_status` to leave the queue; other queued spends have no action.
    const action = getPayoutAction({
      status: spend.status,
      validFrom: spend.validFrom,
      spendExpireAt: spend.spendExpireAt,
      latestHeight,
      isHead: false,
      inOrder: true,
    });

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
      <div key="maturity" className="text-right text14Medium">
        <SpendMaturity
          spend={spend}
          latestHeight={latestHeight}
          blockTime={blockTime}
        />
      </div>,
      isNil(spend.amount) ? (
        <span key="amount">-</span>
      ) : (
        <ValueDisplay key="amount" value={spend.amount} symbol={queue.symbol} />
      ),
      <div key="action" className="flex justify-end">
        {action?.call ? (
          <PayoutActionButton
            spend={spend}
            symbol={queue.symbol}
            action={action}
            hint={getPayoutActionHint({
              action,
              isHead: false,
              inOrder: true,
              validFrom: spend.validFrom,
              spendExpireAt: spend.spendExpireAt,
              latestHeight,
              blockTime,
            })}
          />
        ) : (
          <span className="text-textTertiary">-</span>
        )}
      </div>,
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
            firstQueuedOrderKey={queue.queue[0]?.orderKey}
            latestHeight={latestHeight}
            treasuryBalance={queue.treasuryBalance}
          />
        ) : (
          <Item key={idx} row={rowList[idx]} />
        )
      }
    />
  );
}

export default function PayoutQueueCard({ queue, latestHeight }) {
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
        <WaitingQueue queue={queue} latestHeight={latestHeight} />
      </SecondaryCard>
    </div>
  );
}
