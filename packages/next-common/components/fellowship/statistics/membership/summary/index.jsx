import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState, useEffect } from "react";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsMembershipApi } from "next-common/services/url";
import Loading from "next-common/components/loading";
import BigNumber from "bignumber.js";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import { useFellowshipParams } from "next-common/hooks/fellowship/useFellowshipParams";
import StatisticsMembershipSummaryItems from "./summaryItems";
import { translateCollectiveMembersRankData } from "next-common/components/fellowship/statistics/common";

function getRankSalaryData(data, members = []) {
  const { activeSalary = [], passiveSalary = [] } = data;
  const rankArr = translateCollectiveMembersRankData(members);

  let totalActiveSalary = new BigNumber(0);
  let totalPassiveSalary = new BigNumber(0);

  Object.entries(rankArr).forEach(([rank, { count }]) => {
    totalActiveSalary = totalActiveSalary.plus(
      new BigNumber(getRankSalary(activeSalary, rank)).times(count),
    );
    totalPassiveSalary = totalPassiveSalary.plus(
      new BigNumber(getRankSalary(passiveSalary, rank)).times(count),
    );
  });

  return {
    totalActiveSalary,
    totalPassiveSalary,
  };
}

const LoadingContent = (
  <div className="flex justify-center items-center grow w-full h-full">
    <Loading size={24} />
  </div>
);

export default function StatisticsMembershipSummary({ members = [] }) {
  const { isLoading: fellowshipParamsLoading, params } = useFellowshipParams();

  const [summaryData, setSummaryData] = useState(null);
  const membershipApi = fellowshipStatisticsMembershipApi;

  const { value = {}, loading: fellowshipMembershipLoading } =
    useAsync(async () => {
      if (!membershipApi) {
        return {};
      }

      try {
        const resp = await nextApi.fetch(membershipApi);
        return resp?.result || {};
      } catch (error) {
        return {};
      }
    }, []);

  useEffect(() => {
    if (
      value &&
      params &&
      members &&
      !fellowshipMembershipLoading &&
      !fellowshipParamsLoading
    ) {
      const salaryData = getRankSalaryData(params, members);
      setSummaryData({
        ...value,
        ...salaryData,
      });
    }
  }, [
    value,
    params,
    members,
    fellowshipMembershipLoading,
    fellowshipParamsLoading,
  ]);

  return (
    <SecondaryCard>
      {fellowshipMembershipLoading || fellowshipParamsLoading ? (
        LoadingContent
      ) : (
        <StatisticsMembershipSummaryItems summaryData={summaryData} />
      )}
    </SecondaryCard>
  );
}
