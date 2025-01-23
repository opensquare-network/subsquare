import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipTreasury from "./treasury";
import FellowshipSalary from "./salary";
import FellowshipCurrentSalaryCycle from "./currentSalaryCycle";

export default function FellowshipFinanceOverview() {
  return (
    <CollectivesProvider>
      <TitleContainer className="mb-4">Fellowship Finance</TitleContainer>

      <SecondaryCard className="flex">
        <FellowshipTreasury />
        <FellowshipSalary />
        <FellowshipCurrentSalaryCycle />
      </SecondaryCard>
    </CollectivesProvider>
  );
}
