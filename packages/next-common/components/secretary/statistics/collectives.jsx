import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SecretaryStatisticsSummary from "next-common/components/secretary/statistics/summary";
import StatisticsCycles from "next-common/components/fellowship/statistics/expenditure/cycles";
import SecretaryStatisticsClaimants from "next-common/components/secretary/statistics/claimants";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { usePageProps } from "next-common/context/page";

export default function SecretaryCollectivesStatistics() {
  const { members, loading } = useFellowshipCollectiveMembers();
  const { statistics, secretaryStatisticsMembers } = usePageProps();

  const cycles = statistics?.cycles || [];
  const paymentReferenda = statistics?.paymentReferenda || [];

  return (
    <div className="flex flex-col gap-4">
      <TitleContainer>Salary</TitleContainer>
      <SecretaryStatisticsSummary
        cycles={cycles}
        paymentReferenda={paymentReferenda}
      />
      <StatisticsCycles cycles={cycles} />
      <SecretaryStatisticsClaimants
        members={members}
        membersLoading={loading}
        paymentReferenda={paymentReferenda}
        membersData={secretaryStatisticsMembers || []}
      />
    </div>
  );
}
