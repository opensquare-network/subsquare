import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import {
  secretaryStatisticsCyclesApi,
  secretaryStatisticsMembersApi,
} from "next-common/services/url";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SecretaryStatisticsSummary from "next-common/components/secretary/statistics/summary";
import StatisticsCycles from "next-common/components/fellowship/statistics/expenditure/cycles";
import SecretaryStatisticsClaimants from "next-common/components/secretary/statistics/claimants";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function SecretaryCollectivesStatistics() {
  const { members } = useFellowshipCollectiveMembers();

  const { value: data, loading } = useAsync(async () => {
    const resp = await backendApi.fetch(secretaryStatisticsCyclesApi);
    return resp?.result;
  }, []);

  const cycles = data?.cycles || [];
  const paymentReferenda = data?.paymentReferenda || [];

  return (
    <div className="flex flex-col gap-4">
      <TitleContainer>Salary</TitleContainer>
      <SecretaryStatisticsSummary
        cycles={cycles}
        paymentReferenda={paymentReferenda}
        loading={loading}
      />
      <StatisticsCycles cycles={cycles} loading={loading} />
      <SecretaryStatisticsClaimants
        members={members}
        membersApi={secretaryStatisticsMembersApi}
        paymentReferenda={paymentReferenda}
      />
    </div>
  );
}
