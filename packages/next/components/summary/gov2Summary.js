// bulk copied from `next-common/components/summary/democracySummary`

import Grid from "next-common/components/styled/grid";
import Content from "next-common/components/summary/cardContent";
import Summary from "next-common/components/summary/new";
import {
  SummaryGreyText,
  SummaryItemTitle,
  SummaryItem,
} from "next-common/components/summary/styled";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";

export default function Gov2Summary({ summary }) {
  const { sm } = useScreenSize();

  return (
    <Summary
      title="Referenda"
      description="All active and history referenda of various tracks."
    >
      <Grid columns={sm ? 2 : 3} gap={16}>
        <SummaryItem>
          <SummaryItemTitle>Confirming</SummaryItemTitle>
          <Content>
            <span>{summary.confirmingCount || 0}</span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Deciding</SummaryItemTitle>
          <Content>
            <span>{summary.decidingCount || 0}</span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Active</SummaryItemTitle>
          <Content>
            <span>
              {summary.activeCount || 0}
              <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
            </span>
          </Content>
        </SummaryItem>
      </Grid>
    </Summary>
  );
}
