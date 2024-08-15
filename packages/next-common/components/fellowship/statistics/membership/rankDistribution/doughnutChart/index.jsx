import { Doughnut } from "react-chartjs-2";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import Loading from "next-common/components/loading";
import {
  useDoughnutChartOptions,
  distributionDoughnutChartOptions,
  doughnutChartColors as colors,
  calculateRankStatistics,
} from "next-common/components/fellowship/statistics/common";
import DoughnutChartLabels from "./labels";
import { useNavCollapsed } from "next-common/context/nav";

function handleLabelDatas(members) {
  const rankArr = calculateRankStatistics(members);
  const datas = Object.entries(rankArr).map(
    ([rank, { count, percent }], index) => {
      return {
        label: `Rank ${rank}`,
        bgColor: colors[index],
        count,
        percent,
      };
    },
  );
  return datas.reverse();
}

const LoadingContent = (
  <div className="flex justify-center items-center grow w-full">
    <Loading size={24} />
  </div>
);

function RankChart({ labelDatas, data }) {
  const [navCollapsed] = useNavCollapsed();
  const options = useDoughnutChartOptions(distributionDoughnutChartOptions);
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6",
        navCollapsed
          ? "max-sm:flex-col max-sm:items-center"
          : "max-md:flex-col max-md:items-center",
      )}
    >
      <DoughnutChartLabels labelDatas={labelDatas} />
      <div className="w-[260px] flex items-center">
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
  const [labelDatas, setLabelDatas] = useState([]);

  useEffect(() => {
    if (members) {
      const datas = handleLabelDatas(members);
      setLabelDatas(datas);
      setContentLoading(false);
    }
  }, [members]);

  const data = {
    labels: labelDatas.map((i) => i.label),
    datasets: [
      {
        data: labelDatas.map((item) => item.count),
        backgroundColor: labelDatas.map((item) => item.bgColor),
        borderColor: labelDatas.map((item) => item.bgColor),
        borderWidth: 0,
        name: labelDatas.map((i) => i.label),
        percentage: labelDatas.map(
          (item) => `${(item.percent * 100).toFixed(2)}%`,
        ),
      },
    ],
  };

  return (
    <>
      {contentLoading ? (
        LoadingContent
      ) : (
        <RankChart labelDatas={labelDatas} data={data} />
      )}
    </>
  );
}
