// bulk copied from `next-common/components/summary/democracySummary`

import Content from "next-common/components/summary/cardContent";
import {
  SummaryCard,
  SummaryGreyText,
  SummaryTitle,
  SummaryWrapper,
} from "next-common/components/summary/styled";

export default function Gov2Summary({ summary }) {
  return (
    <SummaryWrapper>
      <SummaryCard>
        <SummaryTitle>Confirming</SummaryTitle>
        <Content>
          <span>{summary.confirmingCount || 0}</span>
        </Content>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Deciding</SummaryTitle>
        <Content>
          <span>{summary.decidingCount || 0}</span>
        </Content>
      </SummaryCard>
      <SummaryCard>
        <SummaryTitle>Active</SummaryTitle>
        <Content>
          <span>
            {summary.activeCount || 0}
            <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
          </span>
        </Content>
      </SummaryCard>
    </SummaryWrapper>
  );
}
