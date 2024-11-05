import BigNumber from "bignumber.js";
import { last, maxBy, range, uniqWith } from "lodash-es";
import "next-common/components/charts/globalConfig";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useThemeSetting } from "next-common/context/theme";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { cn, toPrecision } from "next-common/utils";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import CoretimeSalePanelChartSkeleton from "./skeleton";
import AddressUser from "next-common/components/user/addressUser";

const INDEX_SIZE = 200;
const CHART_LAYOUT_PADDING = 10;

function toIndex(blockHeight) {
  return Math.ceil(blockHeight / INDEX_SIZE);
}

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
  const { coretimeSaleRenewalsChart, coretimeSalePurchasesChart } =
    usePageProps();
  const chainHeight = useSelector(chainOrScanHeightSelector);

  const totalBlocksIndex = toIndex(totalBlocks);
  const initBlockHeightIndex = toIndex(initBlockHeight);
  const saleStartIndex = toIndex(saleStart);
  const fixedStartIndex = toIndex(fixedStart);
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
  const { decimals } = useChainSettings();

  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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
        x: toIndex(renewal.indexer.blockHeight) - initBlockHeightIndex,
        y: toPrecision(renewal.price, decimals),
      });
    }

    return result;
  }, [coretimeSaleRenewalsChart?.items, initBlockHeightIndex, decimals]);

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
        x: toIndex(sale.indexer.blockHeight) - initBlockHeightIndex,
        y: toPrecision(sale.price, decimals),
      });
    }

    return result;
  }, [coretimeSalePurchasesChart?.items, initBlockHeightIndex, decimals]);

  const priceDataset = useMemo(() => {
    const steppedBlocksRange = [
      ...range(saleStart, fixedStart, INDEX_SIZE),
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
        x: toIndex(blockHeight) - initBlockHeightIndex,
        y: price,
      };
    });
  }, [
    coretimeSale.info,
    decimals,
    fixedStart,
    saleStart,
    initBlockHeightIndex,
  ]);

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
            {
              x: renewalPeriodIndexes + (fixedStartIndex - saleStartIndex),
              y: lastPrice,
            },
            // end
            { x: totalBlocksIndex - 1, y: lastPrice },
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
    renewalPeriodIndexes,
    fixedStartIndex,
    saleStartIndex,
    lastPrice,
    totalBlocksIndex,
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

      <Tooltip
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={!!tooltipData}
        data={tooltipData}
      />
    </div>
  );
}

function Tooltip({ x, y, visible, data }) {
  const { symbol } = useChainSettings();

  if (!visible || !data) {
    return null;
  }

  return (
    <div
      className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="rounded py-1.5 px-3 text12Normal text-textPrimaryContrast bg-tooltipBg">
        {data.source && <div>Type: {data.source}</div>}
        {data.blockHeight && (
          <div>Block: {Number(data.blockHeight).toLocaleString()}</div>
        )}
        {data.price && (
          <div>
            Price: ≈{data.price?.toFixed?.(2)} {symbol}
          </div>
        )}
        {data.who && (
          <div className="inline-flex items-center">
            <span className="mr-1">Who:</span>
            <AddressUser
              add={data.who}
              fontSize={12}
              addressClassName="!text12Medium !text-textPrimaryContrast"
              noEvent
              noTooltip
            />
          </div>
        )}
      </div>
    </div>
  );
}
