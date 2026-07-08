import React from "react";
import BarChart from "./barChart";
import { startCase } from "lodash-es";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";
import { normalizeSalaryAssetValue } from "next-common/components/collectives/salaryAssetValues";

function getCycleTotal(value) {
  const v = normalizeSalaryAssetValue(value);
  return new BigNumber(v.usdt || 0).plus(v.hollar || 0).toNumber();
}

function getTooltipTitle(item) {
  const tooltipItem = item[0];
  const { label = "" } = tooltipItem;
  return `Cycle ${label}`;
}

function getTooltipLabel(item, currentDataset) {
  const { dataset, datasetIndex } = item;
  const {
    registeredPaidCount,
    unRegisteredPaidCount,
    registeredPaid,
    unRegisteredPaid,
  } = currentDataset;

  const registeredTotal = normalizeSalaryAssetValue(registeredPaid);
  const unRegisteredTotal = normalizeSalaryAssetValue(unRegisteredPaid);
  const totalUsdt = new BigNumber(registeredTotal.usdt || 0).plus(
    unRegisteredTotal.usdt || 0,
  );
  const totalHollar = new BigNumber(registeredTotal.hollar || 0).plus(
    unRegisteredTotal.hollar || 0,
  );
  const totalPaid = totalUsdt.plus(totalHollar).toNumber();

  const abbreviatedPaid = (value) => {
    if (value >= 1000) {
      return abbreviateBigNumber(value, 2);
    }
    return value.toFixed(2);
  };

  if (datasetIndex === 0) {
    const registeredTotalNum = new BigNumber(registeredTotal.usdt || 0)
      .plus(registeredTotal.hollar || 0)
      .toNumber();
    return [
      `Total: $${abbreviatedPaid(totalPaid)}`,
      `${dataset.label}: $${abbreviatedPaid(registeredTotalNum)}`,
    ];
  }
  if (datasetIndex === 1) {
    const unRegisteredTotalNum = new BigNumber(unRegisteredTotal.usdt || 0)
      .plus(unRegisteredTotal.hollar || 0)
      .toNumber();
    return [
      `${dataset.label}: $${abbreviatedPaid(unRegisteredTotalNum)}`,
      `Registered Paid Count: ${registeredPaidCount}`,
      `Unregistered Paid Count: ${unRegisteredPaidCount}`,
    ];
  }
}

export default function CyclesChart({ values }) {
  const height = 180;
  const categoryPercentage = 0.6;
  const barPercentage = 1;

  const labels = values.map((value) => `# ${startCase(value.index)}`);
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Registered Paid",
      data: values.map((value) => getCycleTotal(value.registeredPaid)),
      backgroundColor: "rgba(230, 0, 122, 1)",
      tooltip: true,
    },
    {
      categoryPercentage,
      barPercentage,
      label: "Unregistered Paid",
      data: values.map((value) => getCycleTotal(value.unRegisteredPaid)),
      backgroundColor: "rgba(230, 0, 122, 0.4)",
      tooltip: true,
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return (
    <BarChart
      height={height}
      data={data}
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              title: getTooltipTitle,
              label: (item) => {
                const currentDataset = values[item.dataIndex];
                return getTooltipLabel(item, currentDataset);
              },
            },
          },
        },
      }}
    />
  );
}
