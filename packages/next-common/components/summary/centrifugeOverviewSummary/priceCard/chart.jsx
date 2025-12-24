import { Line } from "react-chartjs-2";
import "../../../charts/globalConfig";
import dayjs from "dayjs";
import { noop, merge } from "lodash-es";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { useThemeSetting } from "next-common/context/theme";
import { bnToLocaleString } from "next-common/utils/bn";

export default function PriceCardContentChart({
  data,
  onHover = noop,
  chartOptions: chartOptionsProp = {},
}) {
  const themeSettings = useThemeSetting();

  const width = useWindowWidthContext();

  const prices = data || [];

  const labels = prices.map?.(({ time }) => time);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: prices.map?.(({ price }) => price),
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
              100: themeSettings.theme300,
            },
          },
        },
      },
    ],
  };

  const chartOptions = merge(
    {
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
              return `$${bnToLocaleString(tooltipItem.raw, 3)}`;
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
    },
    chartOptionsProp,
  );

  return (
    <div className="w-full h-[144px] overflow-hidden">
      <Line key={width} options={chartOptions} data={chartData} />
    </div>
  );
}
