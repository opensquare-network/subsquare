import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import { ActiveTag } from "next-common/components/tags/state/styled";

export default function FellowshipSalaryCycleDetailInfoOngoing({ cycle = {} }) {
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
        <div className="flex items-start">
          <ActiveTag>Ongoing</ActiveTag>
        </div>
      </div>
    </PrimaryCard>
  );
}
