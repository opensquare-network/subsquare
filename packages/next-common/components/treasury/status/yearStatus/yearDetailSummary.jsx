import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { isNil } from "lodash-es";

export default function YearDetailSummary({ summary }) {
  if (isNil(summary)) {
    return null;
  }

  return (
    <SummaryLayout>
      <SummaryItem title="Total">
        <ValueDisplay value={toPrecision(summary.total)} symbol="" prefix="$" />
      </SummaryItem>
      {summary.proposals > 0 && (
        <SummaryItem title="Proposals">
          <ValueDisplay
            value={toPrecision(summary.proposals)}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
      )}
      {summary.spends > 0 && (
        <SummaryItem title="Spends">
          <ValueDisplay
            value={toPrecision(summary.spends)}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
      )}
      {summary.tips > 0 && (
        <SummaryItem title="Tips">
          <ValueDisplay
            value={toPrecision(summary.tips)}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
      )}
      {summary.bounties > 0 && (
        <SummaryItem title="Bounties">
          <ValueDisplay
            value={toPrecision(summary.bounties)}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
      )}
      {summary.childBounties > 0 && (
        <SummaryItem title="Child Bounties">
          <ValueDisplay
            value={toPrecision(summary.childBounties)}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
      )}
    </SummaryLayout>
  );
}
