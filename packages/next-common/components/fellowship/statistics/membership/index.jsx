import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import StatisticsMembershipSummary from "./summary";
import StatisticsMembershipByRank from "./rankDistribution";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function StatisticsMembership() {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div className="flex flex-col gap-[16px]">
      <TitleContainer>Membership</TitleContainer>
      <div
        className={cn(
          "grid grid-cols-2 gap-4",
          navCollapsed
            ? "max-[1140px]:grid-cols-1"
            : "max-[1365px]:grid-cols-1",
        )}
      >
        <StatisticsMembershipByRank />
        <StatisticsMembershipSummary />
      </div>
    </div>
  );
}
