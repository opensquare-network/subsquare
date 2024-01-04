import ReferendaDelegatee from "./referendaDelegatee";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "../styled";

export default function DelegateeSummary({ delegatee }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Delegatee</StatisticsTitle>
      <ReferendaDelegatee delegatee={delegatee} />
    </SecondaryCard>
  );
}
