import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import StatisticsExpenditureSummary from "./summary";
import StatisticsCycles from "./cycles";
import StatisticsClaimants from "./claimants";
import "chart.js/auto";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsCyclesApi } from "next-common/services/url";
import StatisticsExpenditureByRank from "./rank";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function StatisticsExpenditure() {
  const cyclesApi = fellowshipStatisticsCyclesApi;
  const [navCollapsed] = useNavCollapsed();

  const { value = [], loading } = useAsync(async () => {
    if (!cyclesApi) {
      return;
    }
    const resp = await nextApi.fetch(cyclesApi);
    return resp?.result;
  }, [cyclesApi]);

  return (
    <div className="flex flex-col gap-[16px]">
      <TitleContainer>Expenditure</TitleContainer>
      <StatisticsExpenditureSummary value={value} loading={loading} />
      <div
        className={cn(
          "grid grid-cols-2 gap-4",
          navCollapsed
            ? "max-[1140px]:grid-cols-1"
            : "max-[1365px]:grid-cols-1",
        )}
      >
        <StatisticsCycles value={value} loading={loading} />
        <StatisticsExpenditureByRank />
      </div>
      <StatisticsClaimants />
    </div>
  );
}
