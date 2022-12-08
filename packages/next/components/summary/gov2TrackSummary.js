import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime } from "next-common/utils";
import {
  SummaryGreyText,
  SummaryItemWrapper,
  SummaryItem,
  SummaryItemTitle,
} from "next-common/components/summary/styled";
import Delegation from "./delegation";
import Summary from "next-common/components/summary/new";
import Content from "next-common/components/summary/cardContent";

export default function Gov2TrackSummary({
  summary,
  period,
  noDelegation = false,
}) {
  const {
    origin,
    description,
    maxDeciding,
    preparePeriod,
    decisionPeriod,
    confirmPeriod,
    id,
  } = period ?? {};

  const blockTime = useSelector(blockTimeSelector);
  const preparePeriodBlockTime = estimateBlocksTime(preparePeriod, blockTime);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);

  let footer = null;
  if (!noDelegation) {
    footer = <Delegation trackId={id} />;
  }

  return (
    <Summary
      title={`Origin: ${origin}`}
      titleExtra={`#${id}`}
      description={description}
      footer={footer}
    >
      <SummaryItemWrapper>
        <SummaryItem>
          <SummaryItemTitle>Capacity</SummaryItemTitle>
          <Content>
            <span>
              {summary.decidingCount || 0}
              <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Total</SummaryItemTitle>
          <Content>
            <span>{summary.total}</span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Prepare Period</SummaryItemTitle>
          <Content>
            <span>
              {preparePeriodBlockTime[0] || 0}
              <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Confirm / Decision</SummaryItemTitle>
          <Content>
            <span>
              <span>
                {confirmPeriodBlockTime[0] || 0}
                <SummaryGreyText> {confirmPeriodBlockTime[1]}</SummaryGreyText>
              </span>

              <SummaryGreyText> / </SummaryGreyText>

              <span>
                {decisionPeriodBlockTime[0] || 0}
                <SummaryGreyText> {decisionPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            </span>
          </Content>
        </SummaryItem>
      </SummaryItemWrapper>
    </Summary>
  );
}
