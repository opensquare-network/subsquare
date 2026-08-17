import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SalaryAssetValues from "next-common/components/collectives/salaryAssetValues";
import { usePageProps } from "next-common/context/page";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorStatisticsUsersApi,
  fellowshipStatisticsUsersApi,
} from "next-common/services/url";
import { useAsync } from "react-use";
import MemberRankChanges from "./memberRankChanges";

function useUserStatisticsData(address, section) {
  let statisticsApi;
  if (address && section === "fellowship") {
    statisticsApi = fellowshipStatisticsUsersApi(address);
  } else if (address && section === "ambassador") {
    statisticsApi = ambassadorStatisticsUsersApi(address);
  }

  return useAsync(async () => {
    if (!statisticsApi) {
      return;
    }

    const resp = await backendApi.fetch(statisticsApi);

    return resp?.result;
  }, [address, statisticsApi]);
}

function ProfileFellowshipStatisticsInfoImpl({ section = "fellowship" }) {
  const {
    id: address,
    fellowshipUserStatistics,
    ambassadorUserStatistics,
  } = usePageProps();

  // Prefer SSR-provided statistics, fall back to client-side fetching.
  const serverStatistics =
    section === "ambassador"
      ? ambassadorUserStatistics
      : fellowshipUserStatistics;
  const { value, loading } = useUserStatisticsData(
    isNil(serverStatistics) ? address : null,
    section,
  );
  const statistics = serverStatistics ?? value;
  const isLoading = loading && isNil(serverStatistics);

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout className="grid-cols-3 max-sm:grid-cols-1">
        <SummaryItem title="Total Salary Paid">
          <LoadableContent
            isLoading={isLoading || isNil(statistics?.totalPaid)}
          >
            <SalaryAssetValues salary={statistics?.totalPaid} align="left" />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Joined Cycles">
          <LoadableContent
            isLoading={isLoading || isNil(statistics?.joinedCycles)}
          >
            {statistics?.joinedCycles}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Member Rank Changes">
          <MemberRankChanges value={statistics} loading={isLoading} />
        </SummaryItem>
      </SummaryLayout>
    </NeutralPanel>
  );
}

export default function ProfileFellowshipStatisticsInfo({
  section = "fellowship",
}) {
  if (!section) {
    return null;
  }

  return <ProfileFellowshipStatisticsInfoImpl section={section} />;
}
