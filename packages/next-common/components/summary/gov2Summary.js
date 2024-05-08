import { SummaryGreyText } from "next-common/components/summary/styled";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
export default function Gov2Summary({ summary }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Confirming">
        <span>{summary.confirmingCount || 0}</span>
      </SummaryItem>
      <SummaryItem title="Deciding">
        <span>{summary.decidingCount || 0}</span>
      </SummaryItem>
      <SummaryItem title="Preparing">
        <span>{summary.preparingCount || 0}</span>
      </SummaryItem>
      <SummaryItem title="Active">
        <span>
          {summary.activeCount || 0}
          <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
        </span>
      </SummaryItem>
    </SummaryLayout>
  );
}
