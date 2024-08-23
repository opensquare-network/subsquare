import StatisticsExpenditure from "next-common/components/fellowship/statistics/expenditure";
import StatisticsMembership from "next-common/components/fellowship/statistics/membership";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function FellowshipCollectivesStatistics() {
  const { members } = useFellowshipCollectiveMembers();

  return (
    <div className="flex flex-col gap-y-4">
      <StatisticsMembership members={members} />
      <StatisticsExpenditure members={members} />
    </div>
  );
}
