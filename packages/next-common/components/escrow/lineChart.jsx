import { Line } from "react-chartjs-2";
import "next-common/components/summary/centrifugeOverviewSummary/priceCard/chart";
import dayjs from "dayjs";
import { noop } from "lodash-es";
import { useWindowSize } from "react-use";
import { useThemeSetting } from "next-common/context/theme";
import { bnToLocaleString } from "next-common/utils/bn";

export default function PriceCardContentChart({ data = [], onHover = noop }) {
  const themeSettings = useThemeSetting();

  const { width } = useWindowSize();

  const labels = data.map?.(({ time }) => time) || [];
  const counts = data.map?.(({ count }) => count) || [];

  const maxValue = Math.max(...counts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Count",
        data: data.map?.(({ count }) => count),
        borderWidth: 1,
        borderColor: themeSettings.theme500,
        pointBorderWidth: 0,
        pointRadius: 1,
        pointHitRadius: 10,
        fill: true,
        gradient: {
          backgroundColor: {
            axis: "y",
            colors: {
              0: themeSettings.theme100,
              [maxValue]: themeSettings.theme300,
            },
          },
        },
      },
    ],
  };

  const formatYAxisLabel = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toString() + "M";
    } else if (value >= 1000) {
      return (value / 1000).toString() + "K";
    }
    return value.toString();
  };

  const chartOptions = {
    type: "line",
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
        mode: "index",
        intersect: false,
        bodySpacing: 8,
        callbacks: {
          title(tooltipItems) {
            return dayjs(Number(tooltipItems[0].parsed.x)).format(
              "YYYY-MM-DD hh:mm",
            );
          },
          label(tooltipItem) {
            return `${bnToLocaleString(tooltipItem.raw, 0)}`;
          },
        },
        itemSort(a, b) {
          return a.datasetIndex - b.datasetIndex;
        },
      },
    },
    scales: {
      y: {
        position: "right",
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return formatYAxisLabel(value);
          },
        },
      },
      x: {
        type: "time",
        time: {
          displayFormats: {
            month: "YYYY-MM",
          },
          unit: "day",
        },
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    onHover(_, array) {
      const index = array?.[0]?.index;
      onHover(index);
    },
  };

  return (
    <div className="w-full h-[144px] overflow-hidden">
      <Line key={width} options={chartOptions} data={chartData} />
    </div>
  );
}
