import { Doughnut } from "react-chartjs-2";
import { cn, formatNum } from "next-common/utils";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsRanksApi } from "next-common/services/url";
import Loading from "next-common/components/loading";
import BigNumber from "bignumber.js";
import {
  doughnutChartOptions as options,
  doughnutChartColors as colors,
} from "next-common/components/fellowship/statistics/expenditure/common.js";
import DoughnutChartLabels from "./labels";
import { useNavCollapsed } from "next-common/context/nav";

function getUniqueRanks(members) {
  const rankSet = new Set();
  members.forEach((item) => rankSet.add(item.rank));
  return Array.from(rankSet).sort((a, b) => a - b);
}

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
    const count = ranksDataObj[index] || "";
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
  return datas;
}

const LoadingContent = (
  <div className="flex justify-center items-center grow w-full">
    <Loading size={24} />
  </div>
);

function RankChart({ labelDatas, data }) {
  const [navCollapsed] = useNavCollapsed();
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

export default function StatisticsExpenditureByRank() {
  const members = useSelector(fellowshipCollectiveMembersSelector);
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
