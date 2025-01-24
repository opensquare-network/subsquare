import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipTreasury from "./treasury";
import FellowshipSalary from "./salary";
import FellowshipCurrentSalaryCycle from "./currentSalaryCycle";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function FellowshipFinanceOverview() {
  const [navCollapsed] = useNavCollapsed();

  return (
    <CollectivesProvider>
      <TitleContainer className="mb-4">Fellowship Finance</TitleContainer>

      <SecondaryCard
        className={cn(
          "grid grid-cols-3 gap-4",
          !navCollapsed ? "max-md:grid-cols-2" : "max-sm:grid-cols-2",
        )}
      >
        <FellowshipTreasury />
        <FellowshipSalary />
        <FellowshipCurrentSalaryCycle />
      </SecondaryCard>
    </CollectivesProvider>
  );
}
