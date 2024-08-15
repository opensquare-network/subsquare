import { Doughnut } from "react-chartjs-2";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import {
  useDoughnutChartOptions,
  distributionDoughnutChartOptions,
  doughnutChartColors as colors,
  translateCollectiveMembersRankData,
} from "next-common/components/fellowship/statistics/common";
import DoughnutChartLabels from "./labels";
import { useNavCollapsed } from "next-common/context/nav";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";

function handleLabelDataArr(members) {
  const rankArr = translateCollectiveMembersRankData(members);
  const dataArr = Object.entries(rankArr).map(
    ([rank, { count, percent }], index) => {
      return {
        label: `Rank ${rank}`,
        bgColor: colors[index],
        count,
        percent,
      };
    },
  );
  return dataArr.reverse();
}

function RankChart({ labelDataArr, data }) {
  const [navCollapsed] = useNavCollapsed();
  const options = useDoughnutChartOptions(distributionDoughnutChartOptions);

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
          className="w-[200px] h-[200px] relative"
        />
      </div>
    </div>
  );
}

export default function RankDistributionDoughnutChart({ members = [] }) {
  const [contentLoading, setContentLoading] = useState(true);
  const [labelDataArr, setLabelDataArr] = useState([]);

  useEffect(() => {
    if (members) {
      const dataArr = handleLabelDataArr(members);
      setLabelDataArr(dataArr);
      setContentLoading(false);
    }
  }, [members]);

  const data = {
    labels: labelDataArr.map((i) => i.label),
    datasets: [
      {
        data: labelDataArr.map((item) => item.count),
        backgroundColor: labelDataArr.map((item) => item.bgColor),
        borderColor: labelDataArr.map((item) => item.bgColor),
        borderWidth: 0,
        name: labelDataArr.map((i) => i.label),
        percentage: labelDataArr.map(
          (item) => `${(item.percent * 100).toFixed(2)}%`,
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
