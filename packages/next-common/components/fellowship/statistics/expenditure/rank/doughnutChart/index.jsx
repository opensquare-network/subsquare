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

function getAssetAmount(item, asset) {
  return new BigNumber(item.salary?.[asset] || 0);
}

function getAssetTotalSalary(ranksData, asset) {
  return ranksData.reduce((acc, item) => {
    return acc.plus(getAssetAmount(item, asset));
  }, new BigNumber(0));
}

function transformRanksDataToObject(ranksData, asset) {
  return ranksData.reduce((acc, item) => {
    acc[item.rank] = getAssetAmount(item, asset);
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

function handleAssetLabelDataArr(members, ranksData, asset, symbol) {
  const rankArr = getRankArr(members, ranksData);
  const totalSalary = getAssetTotalSalary(ranksData, asset);
  const ranksDataObj = transformRanksDataToObject(ranksData, asset);
  return rankArr
    .map((rank, index) => {
      const count = ranksDataObj[rank] || new BigNumber(0);
      const percent =
        totalSalary.gt(0) && count.gt(0) ? count.div(totalSalary) : "";
      return {
        label: `Rank ${rank}`,
        bgColor: colors[index],
        count: count.toNumber(),
        salary: {
          [asset]: count.toString(),
        },
        symbol,
        percent,
      };
    })
    .filter((item) => item.count > 0)
    .reverse();
}

function handleLabelDataGroups(members, ranksData) {
  return [
    {
      key: "usdt",
      title: "USDT",
      labelDataArr: handleAssetLabelDataArr(members, ranksData, "usdt", "USDT"),
    },
    {
      key: "hollar",
      title: "HOLLAR",
      labelDataArr: handleAssetLabelDataArr(
        members,
        ranksData,
        "hollar",
        "HOLLAR",
      ),
    },
  ].filter((item) => item.labelDataArr.length > 0);
}

function getChartData(labelDataArr) {
  return {
    labels: labelDataArr.map((i) => i.label),
    datasets: [
      {
        data: labelDataArr.map((item) => item.count),
        backgroundColor: labelDataArr.map((item) => item.bgColor),
        borderColor: labelDataArr.map((item) => item.bgColor),
        borderWidth: 0,
        name: labelDataArr.map((i) => i.label),
        symbol: labelDataArr.map((i) => i.symbol),
        percentage: labelDataArr.map((item) =>
          item.percent ? `${item.percent.times(100).toFixed(2)}%` : "0%",
        ),
      },
    ],
  };
}

function AssetRankChart({ title, labelDataArr }) {
  const data = getChartData(labelDataArr);
  const [navCollapsed] = useNavCollapsed();
  const options = useDoughnutChartOptions(expenditureDoughnutChartOptions);
  return (
    <div className="flex flex-col gap-4">
      <div className="text12Medium text-textTertiary">{title}</div>
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
    </div>
  );
}

function RankChart({ labelDataGroups }) {
  if (labelDataGroups.length === 0) {
    return <span className="text14Medium text-textTertiary">No data</span>;
  }

  return (
    <div className="flex flex-col gap-6">
      {labelDataGroups.map((item) => (
        <AssetRankChart
          key={item.key}
          title={item.title}
          labelDataArr={item.labelDataArr}
        />
      ))}
    </div>
  );
}

export default function RankDoughnutChart({ members = [] }) {
  const ranksApi = fellowshipStatisticsRanksApi;

  const [labelDataGroups, setLabelDataGroups] = useState([]);
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
      const groups = handleLabelDataGroups(members, ranksData);
      setLabelDataGroups(groups);
      setContentLoading(false);
    }
  }, [members, ranksData]);

  return (
    <>
      {contentLoading ? (
        <LoadingContent />
      ) : (
        <RankChart labelDataGroups={labelDataGroups} />
      )}
    </>
  );
}
