import BigNumber from "bignumber.js";
import { last, maxBy, range, uniqWith } from "lodash-es";
import "next-common/components/charts/globalConfig";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useThemeSetting } from "next-common/context/theme";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { cn, toPrecision } from "next-common/utils";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

const STEP_SIZE = 200;
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
    return <Skeleton className={className} />;
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

function Skeleton({ className = "" }) {
  return (
    <div
      className={cn("w-full rounded-lg bg-neutral300 animate-pulse", className)}
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
  const { coretimeSaleRenewalsChart, coretimeSalePurchasesChart } =
    usePageProps();
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const indexes = useMemo(() => {
    return range(0, totalBlocks);
  }, [totalBlocks]);

  const currentIndex = Math.max(
    0,
    Math.min(chainHeight - initBlockHeight, totalBlocks - 1),
  );
  const renewalPeriodBlocks = saleStart - initBlockHeight;

  const theme = useThemeSetting();
  const { decimals, symbol } = useChainSettings();

  const renewalsDataset = useMemo(() => {
    const result = [];

    const data = uniqWith(coretimeSaleRenewalsChart?.items, (a, b) => {
      return (
        a.indexer.blockHeight === b.indexer.blockHeight && a.price === b.price
      );
    });

    for (let i = 0; i < data.length; i++) {
      const renewal = data[i];

      result.push({
        ...renewal,
        x: renewal.indexer.blockHeight - initBlockHeight,
        y: toPrecision(renewal.price, decimals),
      });
    }

    return result;
  }, [coretimeSaleRenewalsChart?.items, initBlockHeight, decimals]);

  const salesDataset = useMemo(() => {
    const result = [];

    const data = uniqWith(coretimeSalePurchasesChart?.items, (a, b) => {
      return (
        a.indexer.blockHeight === b.indexer.blockHeight && a.price === b.price
      );
    });

    for (let i = 0; i < data.length; i++) {
      const sale = data[i];

      result.push({
        ...sale,
        x: sale.indexer.blockHeight - initBlockHeight,
        y: toPrecision(sale.price, decimals),
      });
    }

    return result;
  }, [decimals, initBlockHeight, coretimeSalePurchasesChart?.items]);

  const priceDataset = useMemo(() => {
    const steppedBlocksRange = [
      // from sale start point to fixed price point
      ...Array.from(
        { length: Math.ceil((fixedStart - saleStart) / STEP_SIZE) },
        (_, i) => saleStart + i * STEP_SIZE,
      ),
      // fixed price point
      fixedStart,
    ];

    return steppedBlocksRange.map((blockHeight) => {
      const price = toPrecision(
        getCoretimePriceAt(blockHeight, coretimeSale.info),
        decimals,
      );

      return {
        blockHeight,
        price,
        x: blockHeight - initBlockHeight,
        y: price,
      };
    });
  }, [coretimeSale.info, decimals, fixedStart, initBlockHeight, saleStart]);

  const lastPrice = last(priceDataset)?.price;
  const maxPrice = maxBy(priceDataset, (data) =>
    BigNumber(data.price).toNumber(),
  )?.price;

  const chartData = useMemo(() => {
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
          type: "scatter",
          borderColor: theme.theme300,
          pointRadius: 4,
          pointBackgroundColor: theme.theme300,
          pointBorderColor: theme.theme300,
          pointBorderWidth: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: theme.theme300,
          pointHoverBorderColor: theme.theme300,
          pointHoverBorderWidth: 0,
          pointHitRadius: 10,
        },
        // sale points
        {
          data: salesDataset,
          source: "Sale",
          type: "scatter",
          borderColor: theme.theme500,
          pointRadius: 4,
          pointBackgroundColor: theme.theme500,
          pointBorderColor: theme.theme500,
          pointBorderWidth: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: theme.theme500,
          pointHoverBorderColor: theme.theme500,
          pointHoverBorderWidth: 0,
          pointHitRadius: 10,
        },
        // price line
        {
          data: priceDataset,
          borderColor: theme.theme500,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHitRadius: 0,
          fill: false,
          spanGaps: true,
        },
        // fixed price line
        {
          data: [
            // start
            { x: renewalPeriodBlocks + (fixedStart - saleStart), y: lastPrice },
            // end
            { x: totalBlocks - 1, y: lastPrice },
          ],
          borderColor: theme.theme500,
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHitRadius: 0,
          fill: false,
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
    renewalPeriodBlocks,
    fixedStart,
    saleStart,
    lastPrice,
    totalBlocks,
  ]);

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
        displayColors: false,
        callbacks: {
          title: () => "",
          label(item) {
            const type = item.dataset.source;
            const index = item.dataIndex;
            const price = item.parsed.y;
            const data = item.dataset.data[index];
            const blockHeight = data.indexer?.blockHeight;

            const result = [
              `Type: ${type}`,
              `Block: ${Number(blockHeight).toLocaleString()}`,
              `Price: ≈${price?.toFixed?.(2)} ${symbol}`,
            ];

            if (type === "Renewal") {
              result.push(`Who: ${data.who}`);
            } else if (type === "Sale") {
              result.push(`Who: ${data.who}`);
            }

            return result;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            xMin: renewalPeriodBlocks,
            xMax: renewalPeriodBlocks,
            borderColor: theme.neutral500,
            borderWidth: 1,
            borderDash: [3, 3],
            drawTime: "beforeDatasetsDraw",
          },
        },
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
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
    </div>
  );
}
