import { groupBy, map, max, range } from "lodash-es";
import "next-common/components/charts/globalConfig";
import { useChainSettings } from "next-common/context/chain";
import { useThemeSetting } from "next-common/context/theme";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_CORETIME_SALE_PURCHASES } from "next-common/services/gql/coretime/consts";
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
}) {
  const { decimals } = useChainSettings();
  const { data } = useCoretimeQuery(GET_CORETIME_SALE_PURCHASES, {
    variables: {
      saleId: 7,
      offset: 0,
      limit: 100,
    },
  });
  // get the price at the start of the sale
  const initPrice = toPrecision(
    getCoretimePriceAt(coretimeSale?.info?.saleStart, coretimeSale.info),
    decimals,
  );
  // console.log(initPrice);

  const groupedSales = Object.entries(
    groupBy(data?.coretimeSalePurchases?.items, "indexer.blockHeight"),
  ).map(([height, sale]) => {
    return {
      height,
      price: toPrecision(sale[0].price, decimals),
    };
  });

  const maxPrice = max([initPrice, ...map(groupedSales, "price")]);

  const theme = useThemeSetting();
  const interludeBlocks = interludeEndHeight - initBlockHeight;

  const indexes = range(0, totalBlocks);
  const sales1 = useMemo(() => {
    const result = [];

    for (let i = 0; i < groupedSales.length; i++) {
      const sale = groupedSales[i];
      result[Number(sale.height) - initBlockHeight] = sale.price;
    }

    return result;
  }, [groupedSales, initBlockHeight]);

  const priceLine = useMemo(() => {
    const points = [...sales1];
    points[interludeBlocks] = initPrice;
    return points;
  }, [initPrice, interludeBlocks, sales1]);

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
        // sale points
        {
          data: sales1,
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
      ],
    };
  }, [indexes, priceLine, sales1, theme.neutral500, theme.theme500]);

  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    // parsing: false,
    scales: {
      x: {
        display: false,
        // ticks: {
        //   source: "auto",
        //   // Disabled rotation for performance
        //   maxRotation: 0,
        //   autoSkip: true,
        // },
        // min: initBlockHeight,
        // max: endBlockHeight,
      },
      y: {
        display: false,
        min: 0,
        max: maxPrice,
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
          label(context) {
            return [
              `Block: ${context.dataIndex}`,
              `Price: ${context.parsed?.y}`,
            ];
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
