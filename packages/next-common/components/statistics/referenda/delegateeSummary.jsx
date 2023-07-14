import ReferendaDelegatee from "./referendaDelegatee";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "../styled";

export default function DelegateeSummary({ delegatee }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Delegatee</StatisticsTitle>
      <div className="overflow-x-scroll">
        <ReferendaDelegatee delegatee={delegatee} />
      </div>
    </SecondaryCard>
  );
}
