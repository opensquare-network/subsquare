"use client";

import Tooltip from "next-common/components/tooltip";
import { useRelayChainApi } from "next-common/context/relayChain";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import useNow from "next-common/hooks/useNow";
import { isNil } from "lodash-es";

export default function BlockNumberWithTooltip({ height }) {
  const api = useRelayChainApi();
  const { timestamp, isLoading } = useBlockTimestamp(height, api);
  const now = useNow(30 * 1000);

  if (isNil(height)) {
    return <span className="text14Medium text-textPrimary">#0</span>;
  }

  const tooltipContent = isLoading ? (
    <FieldLoading size={16} />
  ) : timestamp ? (
    <div className="text12Medium">
      <div>{formatTime(timestamp)}</div>
      <div className="text-textTertiary">
        {formatTimeAgo(timestamp, { referenceTime: now })}
      </div>
    </div>
  ) : null;

  return (
    <Tooltip content={tooltipContent}>
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    </Tooltip>
  );
}
