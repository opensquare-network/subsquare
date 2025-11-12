import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber, abbreviateBigNumber } from "next-common/utils";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import BigNumber from "bignumber.js";
import { useTheme } from "styled-components";
import { useThemeSetting } from "next-common/context/theme";

export default function useTreasuryBurnChartData() {
  const { decimals, symbol } = useChainSettings();
  const { burnChart } = usePageProps();
  const { isDark } = useTheme();
  const themeSettings = useThemeSetting();

  if (isNil(burnChart?.result) || burnChart.result.length === 0) {
    return { chartData: null, options: undefined, totalWidth: 0 };
  }

  const BAR_THICKNESS = 7;
  const BAR_GAP = 10;

  let items = burnChart.result
    .map((bar) => ({
      date: formatTime(bar.timestamp, "YYYY-MM-DD"),
      burn: toPrecisionNumber(bar.amount || 0, decimals),
    }))
    .reverse();

  while (items.length > 0 && BigNumber(items[0].burn).isZero()) {
    items.shift();
  }

  const chartData = {
    labels: items.map(() => ""),
    datasets: [
      {
        categoryPercentage: 1,
        barPercentage: 1,
        barThickness: BAR_THICKNESS,
        maxBarThickness: BAR_THICKNESS,
        data: items.map((item) => item.burn),
        backgroundColor: isDark ? themeSettings.theme500 : "#FCB3AD",
      },
    ],
  };

  const totalWidth = items.length * (BAR_THICKNESS + BAR_GAP);

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
            return items[idx]?.date;
          },
          label(tooltipItem) {
            const idx = tooltipItem.dataIndex;
            const burn = items[idx]?.burn;
            return `Burnt: ≈${abbreviateBigNumber(burn)} ${symbol}`;
          },
        },
      },
    },
  };

  return { chartData, options, totalWidth };
}
