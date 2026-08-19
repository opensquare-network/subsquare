import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SalaryAssetValues from "next-common/components/collectives/salaryAssetValues";
import { usePageProps } from "next-common/context/page";
import MemberRankChanges from "./memberRankChanges";

function ProfileFellowshipStatisticsInfoImpl({ section }) {
  const { fellowshipUserStatistics, ambassadorUserStatistics } = usePageProps();
  const userStatistics =
    section === "fellowship"
      ? fellowshipUserStatistics
      : ambassadorUserStatistics;

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout className="grid-cols-3 max-sm:grid-cols-1">
        <SummaryItem title="Total Salary Paid">
          <LoadableContent isLoading={isNil(userStatistics?.totalPaid)}>
            <SalaryAssetValues
              salary={userStatistics?.totalPaid}
              align="left"
            />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Joined Cycles">
          <LoadableContent isLoading={isNil(userStatistics?.joinedCycles)}>
            {userStatistics?.joinedCycles}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Member Rank Changes">
          <MemberRankChanges value={userStatistics} loading={false} />
        </SummaryItem>
      </SummaryLayout>
    </NeutralPanel>
  );
}

export default function ProfileFellowshipStatisticsInfo({
  section = "fellowship",
}) {
  if (section !== "fellowship" && section !== "ambassador") {
    return null;
  }

  return <ProfileFellowshipStatisticsInfoImpl section={section} />;
}
