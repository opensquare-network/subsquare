// bulk copied from `next-common/components/summary/democracySummary`

import Summary from "next-common/components/summary/v2/base";
import { SummaryGreyText } from "next-common/components/summary/styled";
import AllDelegation from "./allDelegation";

export default function Gov2Summary({ summary, noDelegation = false }) {
  let footer;
  if (!noDelegation) {
    footer = <AllDelegation />;
  }

  return (
    <Summary
      footer={footer}
      items={[
        {
          title: "Confirming",
          content: <span>{summary.confirmingCount || 0}</span>,
        },
        {
          title: "Deciding",
          content: <span>{summary.decidingCount || 0}</span>,
        },
        {
          title: "Active",
          content: (
            <span>
              {summary.activeCount || 0}
              <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
            </span>
          ),
        },
      ]}
    />
  );
}
