import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../store/reducers/chainSlice";
import { estimateBlocksTime } from "../../utils";
import Content from "./cardContent";
import {
  SummaryCard,
  SummaryGreyText,
  SummaryTitle,
  SummaryWrapper,
} from "./styled";

export default function Gov2TrackSummary({ summary, period }) {
  const blockTime = useSelector(blockTimeSelector);
  const decisionPeriod = estimateBlocksTime(period?.decisionPeriod, blockTime);
  const confirmPeriod = estimateBlocksTime(period?.confirmPeriod, blockTime);

  return (
    <SummaryWrapper>
      <SummaryCard>
        <SummaryTitle>Deciding</SummaryTitle>
        <Content>
          <span>
            {summary.decidingCount || 0}
            <SummaryGreyText> / {summary.total}</SummaryGreyText>
          </span>
        </Content>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Decision Period</SummaryTitle>
        <Content>
          <span>
            {decisionPeriod[0] || 0}
            <SummaryGreyText> {decisionPeriod[1]}</SummaryGreyText>
          </span>
        </Content>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Confirming Period</SummaryTitle>
        <Content>
          <span>
            {confirmPeriod[0] || 0}
            <SummaryGreyText> {confirmPeriod[1]}</SummaryGreyText>
          </span>
        </Content>
      </SummaryCard>
    </SummaryWrapper>
  );
}
