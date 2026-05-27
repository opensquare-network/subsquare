import { useMemo } from "react";
import Link from "next/link";
import { useAsync } from "react-use";
import { useSelector } from "react-redux";
import { useChainSettings } from "next-common/context/chain";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import useOnChainOngoingReferenda from "next-common/context/onchainReferenda/ongoingReferenda";
import useOnChainReferendaTracks from "next-common/hooks/referenda/useOnChainReferendaTracks";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime } from "next-common/utils";
import { fetchTreasuryItemData } from "next-common/services/treasuryItemsData";
import Tooltip from "next-common/components/tooltip";
import { getOngoingReferendumStatus } from "next-common/utils/referenda";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import { SEVEN_DAYS_MS } from "next-common/utils/constants";

const SOURCE = "referenda";

function buildCountdownItem(referendumIndex, type, remaining, blockTime) {
  if (remaining <= 0) return null;

  const timeLeftMs = BigNumber(remaining).multipliedBy(blockTime).toNumber();
  if (timeLeftMs > SEVEN_DAYS_MS) return null;

  return {
    id: `${SOURCE}-${type}-${referendumIndex}`,
    tag: getReferendumTag(type),
    timeLeftMs,
    estimatedTime: estimateBlocksTime(remaining, blockTime),
    index: referendumIndex,
    type,
  };
}

function getReferendumTag(type) {
  const tags = {
    timeout: "Timeout",
    decision: "Decision",
    confirm: "Confirm",
  };
  return tags[type] || type;
}

function getReferendumActionText(type) {
  const texts = {
    timeout: "timeout",
    decision: "end deciding",
    confirm: "end confirming",
  };
  return texts[type] || type;
}

function ReferendumEventContent({ index, type, estimatedTime }) {
  const { value: data } = useAsync(
    () => fetchTreasuryItemData("gov2/referendums", index),
    [index],
  );

  const title = data?.title?.trim() || `Referenda #${index}`;

  return (
    <>
      <Tooltip content={title}>
        <Link className="font-bold underline" href={`/referenda/${index}`}>
          Referenda #{index}
        </Link>
      </Tooltip>
      <span>
        &nbsp;will {getReferendumActionText(type)} in {estimatedTime}
      </span>
    </>
  );
}

export default function useReferendaUpcomingItems() {
  const { modules } = useChainSettings();
  const { ongoingReferenda } = useOnChainOngoingReferenda();
  const { tracks } = useOnChainReferendaTracks();
  const undecidingTimeout = useUndecidingTimeout();
  const latestHeight = useAhmLatestHeight();
  const blockTime = useSelector(blockTimeSelector);

  return useMemo(() => {
    if (!modules?.referenda) {
      return [];
    }

    if (!blockTime || isNil(latestHeight) || !ongoingReferenda?.length) {
      return [];
    }

    const tracksMap = {};
    for (const track of tracks || []) {
      tracksMap[track.id] = track;
    }

    const items = [];

    for (const [referendumIndex, ongoingReferendum] of ongoingReferenda) {
      const status = getOngoingReferendumStatus(ongoingReferendum);
      const trackId = ongoingReferendum.track.toNumber();
      const track = tracksMap[trackId];

      if (status === "preparing" && undecidingTimeout) {
        const submitted = ongoingReferendum.submitted.toNumber();
        const remaining = submitted + undecidingTimeout - latestHeight;
        const item = buildCountdownItem(
          referendumIndex,
          "timeout",
          remaining,
          blockTime,
        );
        if (item) items.push(item);
      } else if (status === "deciding" && track) {
        const decisionSince = ongoingReferendum.deciding
          .unwrap()
          .since.toNumber();
        const remaining = track.decisionPeriod - (latestHeight - decisionSince);
        const item = buildCountdownItem(
          referendumIndex,
          "decision",
          remaining,
          blockTime,
        );
        if (item) items.push(item);
      } else if (status === "confirming" && track) {
        const confirmSince = ongoingReferendum.deciding
          .unwrap()
          .confirming.unwrap()
          .toNumber();
        const remaining = track.confirmPeriod - (latestHeight - confirmSince);
        const item = buildCountdownItem(
          referendumIndex,
          "confirm",
          remaining,
          blockTime,
        );
        if (item) items.push(item);
      }
    }

    return items
      .sort((a, b) => a.timeLeftMs - b.timeLeftMs)
      .map((item) => ({
        id: item.id,
        tag: item.tag,
        timeLeftMs: item.timeLeftMs,
        content: (
          <ReferendumEventContent
            index={item.index}
            type={item.type}
            estimatedTime={item.estimatedTime}
          />
        ),
      }));
  }, [
    modules?.referenda,
    ongoingReferenda,
    tracks,
    undecidingTimeout,
    latestHeight,
    blockTime,
  ]);
}
