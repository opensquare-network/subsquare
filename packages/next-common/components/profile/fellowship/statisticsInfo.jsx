import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorStatisticsUsersApi,
  fellowshipStatisticsUsersApi,
} from "next-common/services/url";
import { toPrecision } from "next-common/utils";
import { useAsync } from "react-use";
import MemberRankChanges from "./memberRankChanges";

function useUserStatisticsData(address, section) {
  let statisticsApi;
  if (section === "fellowship") {
    statisticsApi = fellowshipStatisticsUsersApi(address);
  } else if (section === "ambassador") {
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
  const { id: address, claimantCycleStats } = usePageProps();
  const { value, loading } = useUserStatisticsData(address, section);
  const { decimals, symbol } = getSalaryAsset();

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout className="grid-cols-3 max-sm:grid-cols-1">
        <SummaryItem title="Total Salary Paid">
          <LoadableContent isLoading={loading || isNil(value?.totalPaid)}>
            <ValueDisplay
              value={toPrecision(value?.totalPaid, decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Joined Cycles">
          <LoadableContent isLoading={loading}>
            {claimantCycleStats?.cycles || "-"}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Member Rank Changes">
          <MemberRankChanges value={value} loading={loading} />
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
