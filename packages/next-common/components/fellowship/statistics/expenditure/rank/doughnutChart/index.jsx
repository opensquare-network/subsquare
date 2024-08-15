import { Doughnut } from "react-chartjs-2";
import { cn } from "next-common/utils";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsRanksApi } from "next-common/services/url";
import Loading from "next-common/components/loading";
import BigNumber from "bignumber.js";
import {
  useDoughnutChartOptions,
  expenditureDoughnutChartOptions,
  doughnutChartColors as colors,
  getUniqueRanks,
} from "next-common/components/fellowship/statistics/common.js";
import DoughnutChartLabels from "./labels";
import { useNavCollapsed } from "next-common/context/nav";

function getTotalSalary(ranksData) {
  return ranksData.reduce((acc, item) => {
    return acc.plus(new BigNumber(item.salary));
  }, new BigNumber(0));
}

function transformRanksDataToObject(ranksData) {
  return ranksData.reduce((acc, item) => {
    acc[item.rank] = new BigNumber(item.salary);
    return acc;
  }, {});
}

function handleLabelDatas(members, ranksData) {
  const rankArr = getUniqueRanks(members);
  const totalSalary = getTotalSalary(ranksData);
  const ranksDataObj = transformRanksDataToObject(ranksData);
  const datas = rankArr.map((rank, index) => {
    const count = ranksDataObj[index] || 0;
    const percent = ranksDataObj[index]
      ? new BigNumber(ranksDataObj[index]).div(totalSalary)
      : "";
    return {
      label: `Rank ${rank}`,
      bgColor: colors[index],
      count,
      percent,
    };
  });
  return datas.reverse();
}

const LoadingContent = (
  <div className="flex justify-center items-center grow w-full">
    <Loading size={24} />
  </div>
);

function RankChart({ labelDatas, data }) {
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
      <DoughnutChartLabels labelDatas={labelDatas} className="w-full" />
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

export default function RankDoughnutChart({ members = [] }) {
  const [labelDatas, setLabelDatas] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  const ranksApi = fellowshipStatisticsRanksApi;

  const { value: ranksData } = useAsync(async () => {
    setContentLoading(true);
    if (!ranksApi) {
      return [];
    }
    try {
      const resp = await nextApi.fetch(ranksApi);
      return resp?.result || [];
    } catch (error) {
      setContentLoading(false);
      return [];
    }
  }, []);

  useEffect(() => {
    if (members && ranksData) {
      const datas = handleLabelDatas(members, ranksData);
      setLabelDatas(datas);
      setContentLoading(false);
    }
  }, [members, ranksData]);

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
