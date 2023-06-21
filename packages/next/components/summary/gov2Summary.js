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
import AllDelegation from "./allDelegation";

export default function Gov2Summary({ summary, noDelegation = false, title }) {
  const { sm } = useScreenSize();

  let footer;
  if (!noDelegation) {
    footer = <AllDelegation />;
  }

  return (
    <Summary
      title={title ?? "Referenda"}
      description="All active and history referenda of various tracks."
      footer={footer}
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
