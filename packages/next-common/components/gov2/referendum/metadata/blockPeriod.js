import React from "react";
import { estimateBlocksTime } from "../../../../utils";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../../../store/reducers/chainSlice";
import { useMemo } from "react";
import { GreyText, ValueWrapper } from "./styled";

export default function BlockPeriod({ block }) {
  const blockTime = useSelector(blockTimeSelector);

  const decisionPeriod = useMemo(() => {
    return estimateBlocksTime(block, blockTime);
  }, [block, blockTime]);

  return (
    <ValueWrapper>
      <div>{decisionPeriod}</div>
      <GreyText>({block.toLocaleString()} blocks)</GreyText>
    </ValueWrapper>
  );
}
