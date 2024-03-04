import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import { ClosedTag } from "next-common/components/tags/state/styled";

export default function FellowshipSalaryCycleDetailInfoClosed({ cycle = {} }) {
  return (
    <PrimaryCard>
      <div className="flex justify-between gap-x-4">
        <SummaryItems
          items={[
            {
              title: "Cycle",
              content: cycle.index,
            },
          ]}
        />
        <div className="flex">
          <ClosedTag>Closed</ClosedTag>
        </div>
      </div>
    </PrimaryCard>
  );
}
