"use client";

import Tooltip from "next-common/components/tooltip";
import { useRelayChainApi } from "next-common/context/relayChain";
import { useChainSettings } from "next-common/context/chain";
import { estimateBlocksTime } from "next-common/utils";
import useCall from "next-common/utils/hooks/useCall";
import { isNil } from "lodash-es";

export default function BlockNumberWithTooltip({ height }) {
  const api = useRelayChainApi();
  const { blockTime } = useChainSettings();
  const { value: currentNumber } = useCall(api?.query?.system?.number, []);
  const currentHeight = currentNumber?.toNumber();

  if (isNil(height) || isNil(currentHeight)) {
    return (
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    );
  }

  const diff = Math.max(0, currentHeight - height);
  const estimatedTime = diff > 0 ? estimateBlocksTime(diff, blockTime) : null;

  return (
    <Tooltip content={estimatedTime ? `${estimatedTime} ago` : ""}>
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    </Tooltip>
  );
}
