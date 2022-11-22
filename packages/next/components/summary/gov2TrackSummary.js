import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { p_14_normal, p_20_bold } from "next-common/styles/componentCss";
import { estimateBlocksTime } from "next-common/utils";
import Content from "next-common/components/summary/cardContent";
import {
  SummaryCard,
  SummaryGreyText,
  SummaryTitle,
} from "next-common/components/summary/styled";
import { smcss } from "next-common/utils/responsive";
import Divider from "next-common/components/styled/layout/divider";
import Delegation from "./delegation";

const Wrapper = styled(SummaryCard)`
  height: auto;
`;

const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TitleTrackId = styled.span`
  color: ${(p) => p.theme.textPlaceholder};
  ${p_20_bold}
`;
const Title = styled.h2`
  margin: 0;
  color: ${(p) => p.theme.textPrimary};
  ${p_20_bold}
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  color: ${(p) => p.theme.textTertiary};
  ${p_14_normal};
`;

const SummariesWrapper = styled.div`
  display: flex;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

const SummaryItem = styled.div`
  flex: 1;
`;

export default function Gov2TrackSummary({ summary, period }) {
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

  return (
    <Wrapper>
      <div style={{ marginBottom: "16px" }}>
        <TitleGroup>
          <Title>Origin: {origin}</Title>
          <TitleTrackId>#{id}</TitleTrackId>
        </TitleGroup>
        {description && <Description>{description}</Description>}
      </div>

      <SummariesWrapper>
        <SummaryItem>
          <SummaryTitle>Capacity</SummaryTitle>
          <Content>
            <span>
              {summary.decidingCount || 0}
              <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryTitle>Total</SummaryTitle>
          <Content>
            <span>{summary.total}</span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryTitle>Prepare Period</SummaryTitle>
          <Content>
            <span>
              {preparePeriodBlockTime[0] || 0}
              <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryTitle>Confirm / Decision</SummaryTitle>
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
      </SummariesWrapper>

      <Divider margin={16} />

      <Delegation trackId={id} />
    </Wrapper>
  );
}
