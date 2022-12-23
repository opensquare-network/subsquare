// bulk copied from `next-common/components/summary/democracySummary`

import styled from "styled-components";
import Content from "next-common/components/summary/cardContent";
import {
  SummaryCard,
  SummaryGreyText,
  SummaryTitle,
  SummaryWrapper,
} from "next-common/components/summary/styled";

const Card = styled(SummaryCard)`
  height: 88px;
`;

export default function Gov2Summary({ summary }) {
  return (
    <SummaryWrapper>
      <Card>
        <SummaryTitle>Confirming</SummaryTitle>
        <Content>
          <span>{summary.confirmingCount || 0}</span>
        </Content>
      </Card>
      <Card>
        <SummaryTitle>Deciding</SummaryTitle>
        <Content>
          <span>{summary.decidingCount || 0}</span>
        </Content>
      </Card>
      <Card>
        <SummaryTitle>Active</SummaryTitle>
        <Content>
          <span>
            {summary.activeCount || 0}
            <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
          </span>
        </Content>
      </Card>
    </SummaryWrapper>
  );
}
