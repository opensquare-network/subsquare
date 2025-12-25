import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import "../../../../charts/globalConfig";
import { usePageProps } from "next-common/context/page";
import { useThemeSetting } from "next-common/context/theme";
import CuratorIndicators from "./curatorIndicators";
import CuratorSummary from "./curatorSummary";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

const colors = [
  "#EB558999",
  "#785DF399",
  "#E47E5299",
  "#4CAF9199",
  "#0F6FFF99",
  "#FF980080",
  "#2196F399",
];

function useChartData({ curators, totalFiat, category }) {
  const { neutral100 } = useThemeSetting();

  const data = useMemo(() => {
    if (!curators?.length) {
      return null;
    }
    const curatorColors = curators.map(
      (_, index) => colors[index % colors.length],
    );
    const curatorNames = curators.map((curator) => curator.address);
    const curatorNameAbbrs = curators.map((curator) => curator.address);
    const curatorFiatAtFinals = curators.map(
      (curator) => curator.totalPayoutFiatValue,
    );
    const curatorPercentages = curators.map(
      (curator) =>
        BigNumber(curator.totalPayoutFiatValue)
          .dividedBy(totalFiat)
          .multipliedBy(100)
          .toFixed(2) + "%",
    );

    return {
      category,
      labels: curatorNames,
      datasets: [
        {
          label: "Curators",
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
  }, [curators, totalFiat, neutral100, category]);

  return data;
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

function Chart({ curators, totalFiat, category }) {
  const data = useChartData({ curators, totalFiat, category });
  return (
    <div className="grid grid-cols-3 w-full items-center">
      <CuratorSummary totalFiat={totalFiat} />
      <CuratorIndicators data={data} curators={curators} />
      <DoughnutChart data={data} />
    </div>
  );
}

export default function CuratorChart() {
  const { statistics } = usePageProps();
  const curators = Object.entries(statistics.curators).map(
    ([address, data]) => ({
      address,
      ...data,
    }),
  );
  const totalFiat = statistics.categories.curator.totalPayoutFiatValue;
  return (
    <SecondaryCard className="flex flex-col gap-y-4">
      <div className="text-textPrimary text14Bold">Curators</div>
      <div className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
        <Chart curators={curators} totalFiat={totalFiat} category="curator" />
      </div>
    </SecondaryCard>
  );
}
