import { omit } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import { useThemeSetting } from "next-common/context/theme";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { formatNum } from "next-common/utils";
import { Doughnut } from "react-chartjs-2";

export default function CuratorVSOthersChart() {
  const { statistics } = usePageProps();
  const totalCuratorFiat = Number(
    statistics.categories.curator?.totalPayoutFiatValue || 0,
  );
  const totalOthersFiat = Object.values(
    omit(statistics.categories, "curator"),
  ).reduce((acc, category) => acc + Number(category.totalPayoutFiatValue), 0);
  const totalFiat = totalCuratorFiat + totalOthersFiat;

  const categories = [
    {
      name: "Curator",
      totalPayoutFiatValue: totalCuratorFiat,
    },
    {
      name: "Others",
      totalPayoutFiatValue: totalOthersFiat,
    },
  ];

  return (
    <SecondaryCard className="flex flex-col gap-y-4">
      <div className="text-textPrimary text14Bold">All</div>
      <div className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
        <Chart categories={categories} totalFiat={totalFiat} />
      </div>
    </SecondaryCard>
  );
}

const colors = [
  "#EB558999",
  "#785DF399",
  "#E47E5299",
  "#4CAF9199",
  "#0F6FFF99",
  "#FF980080",
  "#2196F399",
];

function useChartData({ categories, totalFiat }) {
  const { neutral100 } = useThemeSetting();

  const data = useMemo(() => {
    if (!categories?.length) {
      return null;
    }
    const curatorColors = categories.map(
      (_, index) => colors[index % colors.length],
    );
    const curatorNames = categories.map((category) => category.name);
    const curatorNameAbbrs = categories.map((category) => category.name);
    const curatorFiatAtFinals = categories.map(
      (category) => category.totalPayoutFiatValue,
    );
    const curatorPercentages = categories.map(
      (category) =>
        BigNumber(category.totalPayoutFiatValue)
          .dividedBy(totalFiat)
          .multipliedBy(100)
          .toFixed(2) + "%",
    );

    return {
      labels: curatorNames,
      datasets: [
        {
          label: "All",
          data: curatorFiatAtFinals,
          name: curatorNames,
          nameAbbrs: curatorNameAbbrs,
          backgroundColor: curatorColors,
          borderColor: neutral100,
          borderWidth: 3,
          hoverBorderColor: neutral100,
          hoverBorderWidth: 3,
          borderRadius: 5,
          spacing: 0,
          percentage: curatorPercentages,
        },
      ],
    };
  }, [categories, totalFiat, neutral100]);

  return data;
}

function Indicators({ data, categories = [] }) {
  if (!data) {
    return null;
  }

  const { labels, datasets } = data;
  const { name, backgroundColor, data: fiatAtFinals } = datasets[0];

  return (
    <div className="flex flex-1 flex-col gap-y-2 justify-center text12Medium">
      {labels.map((label, index) => (
        <div
          key={index}
          role="button"
          className="flex justify-between items-center"
        >
          <div
            className="flex items-center"
            title={`${name[index]} ${formatNum(fiatAtFinals[index])}`}
          >
            <span
              className="w-[12px] h-[12px] rounded-[2px] inline-block mr-2"
              style={{ backgroundColor: backgroundColor[index] }}
            />
            <span className="text-textPrimary">
              {categories?.[index]?.nameAbbr ?? name[index]}
            </span>
            <span className="text-textPrimary ml-1">
              {formatNum(fiatAtFinals[index])}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function useDoughnutChartOptions() {
  const { textPrimary } = useThemeSetting();

  return useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        annotation: {
          display: false,
        },
        outlabels: {
          text: (context) => {
            const percentage =
              context.dataset.percentage?.[context.dataIndex] ?? "";
            return percentage;
          },
          font: {
            size: 11,
            weight: 500,
          },
          color: textPrimary,
          backgroundColor: null,
          lineWidth: 1,
          borderRadius: 0,
          borderWidth: 0,
          padding: 0,
          stretch: 1,
        },
      },
      layout: {
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 0,
        },
      },
      cutout: "45%",
      rotation: 5,
    }),
    [textPrimary],
  );
}

function DoughnutChart({ data, category }) {
  const doughnutOptions = useDoughnutChartOptions(category);
  if (!data) {
    return null;
  }
  return (
    <div className="relative flex gap-x-2 w-[190px] h-[110px]">
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
}

function Chart({ categories, totalFiat }) {
  const data = useChartData({ categories, totalFiat });
  return (
    <div className="grid grid-cols-3 w-full items-center max-sm:grid-cols-1 max-sm:gap-y-4">
      <Summary totalFiat={totalFiat} />
      <Indicators data={data} categories={categories} />
      <DoughnutChart data={data} />
    </div>
  );
}
