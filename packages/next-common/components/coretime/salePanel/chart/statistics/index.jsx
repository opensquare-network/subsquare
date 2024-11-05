import BigNumber from "bignumber.js";
import { maxBy, range } from "lodash-es";
import "next-common/components/charts/globalConfig";
import { useThemeSetting } from "next-common/context/theme";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { cn } from "next-common/utils";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import CoretimeSalePanelChartSkeleton from "../skeleton";
import {
  useCoretimeStatisticsPriceDataset,
  useCoretimeStatisticsRenewalsDataset,
  useCoretimeStatisticsSalesDataset,
} from "./hooks";
import CoretimeSalePanelChartStatisticsTooltip from "./tooltip";
import { toIndex } from "./utils";

const CHART_LAYOUT_PADDING = 10;

export default function CoretimeSalePanelChartStatistics({
  className = "",
  coretimeSale,
  initBlockHeight,
  totalBlocks = 0,
  saleStart,
  fixedStart,
  isLoading,
}) {
  if (isLoading) {
    return <CoretimeSalePanelChartSkeleton className={className} />;
  }

  return (
    <StatisticsImpl
      className={className}
      coretimeSale={coretimeSale}
      initBlockHeight={initBlockHeight}
      totalBlocks={totalBlocks}
      saleStart={saleStart}
      fixedStart={fixedStart}
    />
  );
}

function StatisticsImpl({
  className = "",
  coretimeSale,
  initBlockHeight,
  totalBlocks = 0,
  saleStart,
  fixedStart,
}) {
  const chainHeight = useSelector(chainOrScanHeightSelector);

  const totalBlocksIndex = toIndex(totalBlocks);
  const initBlockHeightIndex = toIndex(initBlockHeight);
  const saleStartIndex = toIndex(saleStart);
  const chainHeightIndex = toIndex(chainHeight);

  const indexes = useMemo(() => range(0, totalBlocksIndex), [totalBlocksIndex]);

  const currentIndex = useMemo(() => {
    const endIndex = totalBlocksIndex - 1;

    if (coretimeSale?.isFinal) {
      return endIndex;
    }

    return Math.max(
      0,
      Math.min(chainHeightIndex - initBlockHeightIndex, endIndex),
    );
  }, [
    chainHeightIndex,
    coretimeSale?.isFinal,
    initBlockHeightIndex,
    totalBlocksIndex,
  ]);

  const renewalPeriodIndexes = saleStartIndex - initBlockHeightIndex;

  const theme = useThemeSetting();

  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const renewalsDataset = useCoretimeStatisticsRenewalsDataset({
    initBlockHeightIndex,
  });
  const salesDataset = useCoretimeStatisticsSalesDataset({
    initBlockHeightIndex,
  });
  const priceDataset = useCoretimeStatisticsPriceDataset({
    initBlockHeightIndex,
    saleStart,
    fixedStart,
    coretimeSale,
    totalBlocks,
  });

  const maxPrice = maxBy(priceDataset, (data) =>
    BigNumber(data.price).toNumber(),
  )?.price;

  const chartData = useMemo(() => {
    function getPointConfig(color) {
      return {
        type: "scatter",
        borderColor: color,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointBorderWidth: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 0,
        pointHitRadius: 10,
      };
    }

    return {
      labels: indexes,
      datasets: [
        // progress
        {
          data: [
            { x: 0, y: maxPrice },
            { x: currentIndex, y: maxPrice },
          ],
          fill: true,
          backgroundColor(context) {
            const chart = context.chart;
            const { ctx } = chart;

            const gradient = ctx.createLinearGradient(
              0,
              0,
              ctx.canvas.width,
              0,
            );
            gradient.addColorStop(0, theme.theme100);
            gradient.addColorStop(1, theme.theme300);
            return gradient;
          },
          borderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          hoverBorderWidth: 0,
          pointHitRadius: 0,
        },
        // renewals points
        {
          data: renewalsDataset,
          source: "Renewal",
          ...getPointConfig(theme.theme300),
        },
        // sale points
        {
          data: salesDataset,
          source: "Sale",
          ...getPointConfig(theme.theme500),
        },
        // price line
        {
          data: priceDataset,
          borderColor: theme.theme500,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHitRadius: 0,
          spanGaps: true,
        },
      ],
    };
  }, [
    indexes,
    maxPrice,
    currentIndex,
    renewalsDataset,
    theme.theme300,
    theme.theme500,
    theme.theme100,
    salesDataset,
    priceDataset,
  ]);

  /** @type {import("chart.js").ChartOptions} */
  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    layout: {
      autoPadding: false,
      padding: CHART_LAYOUT_PADDING,
    },
    scales: {
      x: {
        display: false,
        ticks: {
          source: "auto",
          // Disabled rotation for performance
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        display: false,
        min: 0,
        max: maxPrice,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external(context) {
          const { chart, tooltip } = context;

          if (tooltip.opacity === 0) {
            setTooltipData(null);
            return;
          }

          const position = chart.canvas.getBoundingClientRect();
          const dataPoint = tooltip.dataPoints[0];
          const data = dataPoint.dataset.data[dataPoint.dataIndex];

          setTooltipPos({
            x: toIndex(position.left) + tooltip.caretX,
            y: toIndex(position.top) + tooltip.caretY,
          });

          setTooltipData({
            source: dataPoint.dataset.source,
            blockHeight: data.indexer?.blockHeight,
            price: dataPoint.parsed.y,
            who: data.who,
          });
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            xMin: renewalPeriodIndexes,
            xMax: renewalPeriodIndexes,
            borderColor: theme.neutral500,
            borderWidth: 1,
            borderDash: [3, 3],
          },
        },
      },
    },
  };

  return (
    <div className={cn("w-full relative", className)}>
      <div
        className="h-full"
        style={{
          margin: -CHART_LAYOUT_PADDING,
          marginTop: -CHART_LAYOUT_PADDING + 4,
          marginBottom: -CHART_LAYOUT_PADDING + 4,
        }}
      >
        <Line options={options} data={chartData} />
      </div>

      <CoretimeSalePanelChartStatisticsTooltip
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={!!tooltipData}
        data={tooltipData}
      />
    </div>
  );
}
