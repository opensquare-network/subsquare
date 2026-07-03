import { Doughnut } from "react-chartjs-2";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { fellowshipStatisticsRanksApi } from "next-common/services/url";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";
import BigNumber from "bignumber.js";
import {
  doughnutChartColors as colors,
  expenditureDoughnutChartOptions,
  getUniqueRanks,
  useDoughnutChartOptions,
} from "next-common/components/fellowship/statistics/common.js";
import DoughnutChartLabels from "./labels";
import { useNavCollapsed } from "next-common/context/nav";

function getTotalSalary(ranksData) {
  return ranksData.reduce((acc, item) => {
    const s = item.salary || {};
    const usdt = new BigNumber(s.usdt || 0);
    const hollar = new BigNumber(s.hollar || 0);
    return acc.plus(usdt).plus(hollar);
  }, new BigNumber(0));
}

function transformRanksDataToObject(ranksData) {
  return ranksData.reduce((acc, item) => {
    const s = item.salary || {};
    const usdt = new BigNumber(s.usdt || 0);
    const hollar = new BigNumber(s.hollar || 0);
    acc[item.rank] = usdt.plus(hollar);
    acc[`${item.rank}_usdt`] = usdt;
    acc[`${item.rank}_hollar`] = hollar;
    return acc;
  }, {});
}

function getRankArr(members, ranksData) {
  const memberRanks = getUniqueRanks(members || []);
  if (memberRanks.length > 0) {
    return memberRanks;
  }

  return ranksData
    .map((item) => item.rank)
    .filter((rank) => rank !== undefined && rank !== null)
    .sort((a, b) => a - b);
}

function handleLabelDataArr(members, ranksData) {
  const rankArr = getRankArr(members, ranksData);
  const totalSalary = getTotalSalary(ranksData);
  const ranksDataObj = transformRanksDataToObject(ranksData);
  return rankArr
    .map((rank, index) => {
      const count = ranksDataObj[rank] || new BigNumber(0);
      const usdtAmount = ranksDataObj[`${rank}_usdt`] || new BigNumber(0);
      const hollarAmount = ranksDataObj[`${rank}_hollar`] || new BigNumber(0);
      const percent =
        totalSalary.gt(0) && count.gt(0) ? count.div(totalSalary) : "";
      return {
        label: `Rank ${rank}`,
        bgColor: colors[index],
        count: count.toNumber(),
        salary: {
          usdt: usdtAmount.toString(),
          hollar: hollarAmount.toString(),
        },
        percent,
      };
    })
    .filter((item) => item.count > 0)
    .reverse();
}

function RankChart({ labelDataArr, data }) {
  const [navCollapsed] = useNavCollapsed();
  const options = useDoughnutChartOptions(expenditureDoughnutChartOptions);
  return (
    <div
      className={cn(
        "grid gap-6",
        navCollapsed ? "max-sm:grid-cols-1" : "max-md:grid-cols-1",
        "grid-cols-2 max-sm:grid-cols-1 max-md:grid-cols-1",
      )}
    >
      <DoughnutChartLabels labelDataArr={labelDataArr} className="w-full" />
      <div className="w-full flex items-center justify-center">
        <Doughnut
          data={data}
          options={options}
          className="w-50 h-50 relative"
        />
      </div>
    </div>
  );
}

export default function RankDoughnutChart({ members = [] }) {
  const ranksApi = fellowshipStatisticsRanksApi;

  const [labelDataArr, setLabelDataArr] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  const { value: ranksData } = useAsync(async () => {
    setContentLoading(true);
    if (!ranksApi) {
      return [];
    }
    try {
      const resp = await backendApi.fetch(ranksApi);
      return resp?.result || [];
    } catch {
      setContentLoading(false);
      return [];
    }
  }, []);

  useEffect(() => {
    if (members && ranksData) {
      const dataArr = handleLabelDataArr(members, ranksData);
      setLabelDataArr(dataArr);
      setContentLoading(false);
    }
  }, [members, ranksData]);

  const data = {
    labels: labelDataArr.map((i) => i.label),
    datasets: [
      {
        data: labelDataArr.map((item) => item.count),
        backgroundColor: labelDataArr.map((item) => item.bgColor),
        borderColor: labelDataArr.map((item) => item.bgColor),
        borderWidth: 0,
        name: labelDataArr.map((i) => i.label),
        percentage: labelDataArr.map((item) =>
          item.percent ? `${item.percent.times(100).toFixed(2)}%` : "0%",
        ),
      },
    ],
  };

  return (
    <>
      {contentLoading ? (
        <LoadingContent />
      ) : (
        <RankChart labelDataArr={labelDataArr} data={data} />
      )}
    </>
  );
}
