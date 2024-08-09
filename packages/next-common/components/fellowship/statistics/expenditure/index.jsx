import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import StatisticsExpenditureSummary from "./summary";
import StatisticsCycles from "./cycles";
import StatisticsClaimants from "./claimants";
import "chart.js/auto";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsCyclesApi } from "next-common/services/url";

export default function StatisticsExpenditure() {
  const cyclesApi = fellowshipStatisticsCyclesApi;

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
      <StatisticsCycles value={value} loading={loading} />
      <StatisticsClaimants />
    </div>
  );
}
