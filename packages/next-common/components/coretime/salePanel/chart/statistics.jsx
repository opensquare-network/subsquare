import { maxBy, range } from "lodash-es";
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

function Statistics({
  className = "",
  coretimeSale,
  initBlockHeight,
  // endBlockHeight,
  totalBlocks = 0,
  interludeEndHeight,
  fixedBlockHeight,
}) {
  // console.log(fixedBlockHeight);
  const theme = useThemeSetting();
  const { decimals, symbol } = useChainSettings();

  const { data: salesData } = useCoretimeQuery(
    GET_CORETIME_SALE_PURCHASES_CHART,
    {
      variables: {
        saleId: 7,
      },
    },
  );
  const { data: renewalsData } = useCoretimeQuery(
    GET_CORETIME_SALE_RENEWALS_CHART,
    {
      variables: {
        saleId: 7,
      },
    },
  );

  // get the price at the start of the sale
  const initPrice = toPrecision(
    getCoretimePriceAt(coretimeSale?.info?.saleStart, coretimeSale.info),
    decimals,
  );

  const indexes = range(0, totalBlocks);

  const interludeBlocks = interludeEndHeight - initBlockHeight;
  const saleBlocks = fixedBlockHeight - initBlockHeight;

  const renewals = useMemo(() => {
    const result = [];

    for (let i = 0; i < renewalsData?.coretimeSaleRenewals?.items.length; i++) {
      const renewal = renewalsData?.coretimeSaleRenewals?.items[i];

      result.push({
        x: renewal.indexer.blockHeight - initBlockHeight,
        y: toPrecision(renewal.price, decimals),
      });
    }

    return result;
  }, [renewalsData?.coretimeSaleRenewals?.items, initBlockHeight, decimals]);

  const sales = useMemo(() => {
    const result = [];

    for (let i = 0; i < salesData?.coretimeSalePurchases?.items.length; i++) {
      const sale = salesData?.coretimeSalePurchases?.items[i];
      result.push({
        x: sale.indexer.blockHeight - initBlockHeight,
        y: toPrecision(sale.price, decimals),
      });
    }

    return result;
  }, [decimals, initBlockHeight, salesData?.coretimeSalePurchases?.items]);

  const priceLine = useMemo(() => {
    return [...sales, { x: interludeBlocks, y: initPrice }];
  }, [initPrice, interludeBlocks, sales]);

  const lastPrice = toPrecision(
    maxBy(salesData?.coretimeSalePurchases?.items, "price")?.price,
    decimals,
  );

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
          data: renewals,
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
          data: sales,
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
          data: priceLine,
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
            // end
            { x: totalBlocks - 1, y: lastPrice },
            // offset
            { x: saleBlocks, y: lastPrice },
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
    priceLine,
    renewals,
    sales,
    theme,
    lastPrice,
    saleBlocks,
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
      },
      y: {
        display: false,
        min: 0,
        max: initPrice,
      },
    },
    plugins: {
      decimation: {
        enabled: true,
        // algorithm: "min-max",
        algorithm: "lttb",
        samples: 500,
      },
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

            const result = [
              `Type: ${type}`,
              `Block: ${(index + initBlockHeight).toLocaleString()}`,
              `Price: ≈${price.toFixed(2)} ${symbol}`,
            ];

            if (type === "Renewal") {
              result.push(
                `Who: ${renewalsData?.coretimeSaleRenewals?.items[index]?.who}`,
              );
            } else if (type === "Sale") {
              result.push(
                `Who: ${salesData?.coretimeSalePurchases?.items[index]?.who}`,
              );
            }

            return result;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            xMin: interludeBlocks,
            xMax: interludeBlocks,
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
