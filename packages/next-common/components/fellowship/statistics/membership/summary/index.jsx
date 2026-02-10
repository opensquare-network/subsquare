import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { fellowshipStatisticsMembershipApi } from "next-common/services/url";
import BigNumber from "bignumber.js";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import StatisticsMembershipSummaryItems from "./summaryItems";
import {
  LoadingContent,
  translateCollectiveMembersRankData,
} from "next-common/components/fellowship/statistics/common";
import { usePageProps } from "next-common/context/page";

function getRankSalaryData(data, members = []) {
  const { activeSalary = [], passiveSalary = [] } = data;
  const rankArr = translateCollectiveMembersRankData(members);

  let totalActiveSalary = new BigNumber(0);
  let totalPassiveSalary = new BigNumber(0);

  Object.entries(rankArr).forEach(([rank, { count }]) => {
    totalActiveSalary = totalActiveSalary.plus(
      new BigNumber(getRankSalary(activeSalary, parseInt(rank))).times(count),
    );
    totalPassiveSalary = totalPassiveSalary.plus(
      new BigNumber(getRankSalary(passiveSalary, parseInt(rank))).times(count),
    );
  });

  return {
    totalActiveSalary,
    totalPassiveSalary,
  };
}

export default function StatisticsMembershipSummary({ members = [] }) {
  const { fellowshipParams: params } = usePageProps();

  const [summaryData, setSummaryData] = useState(null);
  const membershipApi = fellowshipStatisticsMembershipApi;

  const { value = {}, loading: fellowshipMembershipLoading } =
    useAsync(async () => {
      if (!membershipApi) {
        return {};
      }

      try {
        const resp = await backendApi.fetch(membershipApi);
        return resp?.result || {};
      } catch {
        return {};
      }
    }, []);

  useEffect(() => {
    if (value && params && members && !fellowshipMembershipLoading) {
      const salaryData = getRankSalaryData(params, members);
      setSummaryData({
        ...value,
        ...salaryData,
      });
    }
  }, [value, params, members, fellowshipMembershipLoading]);

  return (
    <SecondaryCard>
      {fellowshipMembershipLoading ? (
        <LoadingContent />
      ) : (
        <StatisticsMembershipSummaryItems summaryData={summaryData} />
      )}
    </SecondaryCard>
  );
}
