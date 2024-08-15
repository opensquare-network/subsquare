import StatisticsExpenditure from "next-common/components/fellowship/statistics/expenditure";
import StatisticsMembership from "next-common/components/fellowship/statistics/membership";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";

export default function FellowshipCollectivesStatistics() {
  const members = useSelector(fellowshipCollectiveMembersSelector);

  return (
    <div className="flex flex-col gap-y-4">
      <StatisticsMembership members={members} />
      <StatisticsExpenditure members={members} />
    </div>
  );
}
