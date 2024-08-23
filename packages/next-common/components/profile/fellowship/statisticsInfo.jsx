import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import nextApi from "next-common/services/nextApi";
import {
  ambassadorStatisticsUsersApi,
  fellowshipStatisticsUsersApi,
} from "next-common/services/url";
import { toPrecision } from "next-common/utils";
import { useAsync } from "react-use";

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

    const resp = await nextApi.fetch(statisticsApi);

    return resp?.result;
  }, [address, statisticsApi]);
}

function ProfileFellowshipStatisticsInfoImpl({ section = "fellowship" }) {
  const { id: address } = usePageProps();
  const { value, loading } = useUserStatisticsData(address, section);
  const { decimals, symbol } = useSalaryAsset();

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout>
        <SummaryItem title="Total Salary Paid">
          <LoadableContent isLoading={loading || isNil(value?.totalPaid)}>
            <ValueDisplay
              value={toPrecision(value?.totalPaid, decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Promotion">
          <LoadableContent isLoading={loading || isNil(value?.promotionTimes)}>
            {value?.promotionTimes}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Demotion">
          <LoadableContent isLoading={loading || isNil(value?.demotionTimes)}>
            {value?.demotionTimes}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Retention">
          <LoadableContent isLoading={loading || isNil(value?.retentionTimes)}>
            {value?.retentionTimes}
          </LoadableContent>
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
