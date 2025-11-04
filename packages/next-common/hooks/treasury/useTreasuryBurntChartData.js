import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import formatTime from "next-common/utils/viewfuncs/formatDate";

export default function useTreasuryBurntChartData() {
  const { decimals, symbol } = useChainSettings();
  const { burntChart } = usePageProps();

  if (
    isNil(burntChart) ||
    isNil(burntChart?.result) ||
    burntChart?.result.length === 0
  ) {
    return { chartData: null, options: undefined, totalWidth: 0 };
  }

  const categoryPercentage = 1;
  const barPercentage = 1;
  const BAR_THICKNESS = 7;
  const BAR_GAP = 10;

  const items = burntChart.result;
  const labels = items.map(() => "");
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      barThickness: BAR_THICKNESS,
      maxBarThickness: BAR_THICKNESS,
      data: items.map((item) => toPrecisionNumber(item.amount || 0, decimals)),
      backgroundColor: "#FCB3AD",
    },
  ];

  const chartData = { labels, datasets };
  const totalWidth = labels.length * (BAR_THICKNESS + BAR_GAP);

  const options = {
    animation: { duration: 0 },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title(itemsInTooltip) {
            const idx = itemsInTooltip[0].dataIndex;
            return formatTime(items[idx]?.timestamp, "YYYY-MM-DD");
          },
          label(tooltipItem) {
            const idx = tooltipItem.dataIndex;
            const burnt = toPrecisionNumber(items[idx]?.amount || 0, decimals);
            return `Burnt: ${burnt} ${symbol}`;
          },
        },
      },
    },
  };

  return { chartData, options, totalWidth };
}
