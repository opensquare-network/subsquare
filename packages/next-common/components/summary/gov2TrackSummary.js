import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { blockTimeSelector } from "../../store/reducers/chainSlice";
import { p_14_normal, p_20_bold } from "../../styles/componentCss";
import { estimateBlocksTime } from "../../utils";
import Content from "./cardContent";
import { SummaryCard, SummaryGreyText, SummaryTitle } from "./styled";
import { smcss } from "../../utils/responsive";

const Wrapper = styled(SummaryCard)`
  height: auto;
`;

const Hr = styled.hr`
  width: 100%;
  height: 1px;
  border: none;
  margin: 16px 0;
  background: ${(p) => p.theme.grey200Border};
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
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);

  return (
    <Wrapper>
      <div>
        <TitleGroup>
          <Title>Origin: {origin}</Title>
          <TitleTrackId>#{id}</TitleTrackId>
        </TitleGroup>
        {description && <Description>{description}</Description>}
      </div>

      <Hr />

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
              {preparePeriod}
              <SummaryGreyText> blocks</SummaryGreyText>
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
    </Wrapper>
  );
}
