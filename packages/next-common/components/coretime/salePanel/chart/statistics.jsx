import { last, maxBy, range, uniqWith } from "lodash-es";
import "next-common/components/charts/globalConfig";
import { useChainSettings } from "next-common/context/chain";
import { useThemeSetting } from "next-common/context/theme";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import {
  GET_CORETIME_SALE_PURCHASES_CHART,
  GET_CORETIME_SALE_RENEWALS_CHART,
} from "next-common/services/gql/coretime/consts";
import { cn, toPrecision } from "next-common/utils";
import { getCoretimePriceAt } from "next-common/utils/coretime/price";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

const STEP_SIZE = 200;

function Statistics({
  className = "",
  coretimeSale,
  initBlockHeight,
  // endBlockHeight,
  totalBlocks = 0,
  saleStart,
  fixedStart,
}) {
  // console.log(fixedBlockHeight);
  const theme = useThemeSetting();
  const { decimals, symbol } = useChainSettings();

  const { data: salesData } = useCoretimeQuery(
    GET_CORETIME_SALE_PURCHASES_CHART,
    {
      variables: {
        saleId: coretimeSale.id,
      },
    },
  );
  const { data: renewalsData } = useCoretimeQuery(
    GET_CORETIME_SALE_RENEWALS_CHART,
    {
      variables: {
        saleId: coretimeSale.id,
      },
    },
  );

  const indexes = range(0, totalBlocks);

  const renewalPeriodBlocks = saleStart - initBlockHeight;

  const renewalsDataset = useMemo(() => {
    const result = [];

    const data = uniqWith(renewalsData?.coretimeSaleRenewals?.items, (a, b) => {
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
  }, [renewalsData?.coretimeSaleRenewals?.items, initBlockHeight, decimals]);

  const salesDataset = useMemo(() => {
    const result = [];

    const data = uniqWith(salesData?.coretimeSalePurchases?.items, (a, b) => {
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
  }, [decimals, initBlockHeight, salesData?.coretimeSalePurchases?.items]);

  const priceDataset = useMemo(() => {
    return Array.from(
      { length: Math.ceil((fixedStart - saleStart) / STEP_SIZE) },
      (_, i) => saleStart + i * STEP_SIZE,
    ).map((blockHeight) => {
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
  const maxPrice = maxBy(priceDataset, "price")?.price;

  const chartData = useMemo(() => {
    return {
      labels: indexes,
      datasets: [
        // {
        //   data: Array(interludeBlocks).fill(maxPrice),
        //   fill: true,
        //   backgroundColor(context) {
        //     const chart = context.chart;
        //     const { ctx } = chart;

        //     const gradient = ctx.createLinearGradient(
        //       0,
        //       0,
        //       ctx.canvas.width,
        //       0,
        //     );
        //     gradient.addColorStop(0, theme.theme100);
        //     gradient.addColorStop(1, theme.theme300);
        //     return gradient;
        //   },
        //   borderWidth: 0,
        //   pointRadius: 0,
        //   pointHoverRadius: 0,
        //   hoverBorderWidth: 0,
        //   pointHitRadius: 0,
        // },
        // renewals points
        {
          data: renewalsDataset,
          source: "Renewal",
          type: "scatter",
          borderColor: theme.theme300,
          // borderWidth: 0,
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
          // borderWidth: 0,
          pointRadius: 4,
          pointBackgroundColor: theme.theme500,
          pointBorderColor: theme.theme500,
          pointBorderWidth: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: theme.theme500,
          pointHoverBorderColor: theme.theme500,
          pointHoverBorderWidth: 0,
          pointHitRadius: 10,
          // showLine: false,
        },
        // price line
        {
          data: priceDataset,
          borderColor: theme.neutral500,
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
          borderColor: theme.neutral500,
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
    renewalsDataset,
    theme.theme300,
    theme.theme500,
    theme.neutral500,
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
    // parsing: false,
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
      // decimation: {
      //   enabled: true,
      //   // algorithm: "min-max",
      //   algorithm: "lttb",
      //   samples: 500,
      // },
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
      <Line options={options} data={chartData} />
    </div>
  );
}

export default Statistics;
