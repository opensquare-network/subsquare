import { estimateBlocksTime } from "../../../../utils";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../../../store/reducers/chainSlice";
import { useMemo } from "react";
import { GreyText, ValueWrapper } from "./styled";

export default function BlockPeriod({ block }) {
  const blockTime = useSelector(blockTimeSelector);

  const decisionPeriod = useMemo(() => {
    const timeArr = estimateBlocksTime(block, blockTime);
    return timeArr.join(" ");
  }, [block, blockTime]);

  return (
    <ValueWrapper>
      <div>{decisionPeriod}</div>
      <GreyText>({block.toLocaleString()} blocks)</GreyText>
    </ValueWrapper>
  );
}
