import { sortBy } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import BigNumber from "bignumber.js";
import BarLabel from "./barChart/barLabel";
import { useMemo, useRef, useState } from "react";
import { formatNum } from "next-common/utils";
import { useTheme } from "styled-components";
import { Bar } from "react-chartjs-2";
import { useElementRect } from "next-common/hooks/useElementRect";
import ProposalsPopup from "./proposalsPopup";
import { AddressUser } from "next-common/components/user";

export default function BeneficiariesList() {
  const { statistics } = usePageProps();
  const beneficiaries = sortBy(
    Object.entries(statistics.beneficiaries).map(([beneficiary, data]) => ({
      beneficiary,
      ...data,
    })),
    (item) => -item.totalPayoutFiatValue,
  );
  const totalFiat = Object.values(statistics.beneficiaries).reduce(
    (acc, beneficiary) => acc.plus(beneficiary.totalPayoutFiatValue),
    new BigNumber(0),
  );

  return (
    <SecondaryCard className="[&>div:first-child]:mb-4">
      <Summary totalFiat={totalFiat} />
      <BarChart categories={beneficiaries} totalFiat={totalFiat} />
    </SecondaryCard>
  );
}

function BarLabels({ labels }) {
  const [showDetail, setShowDetail] = useState(false);
  const [beneficiary, setCategory] = useState({});

  return (
    <div className="flex flex-col gap-1">
      {labels.map((label) => (
        <BarLabel
          key={label}
          label={label}
          onClick={(label) => {
            setCategory(label.data);
            setShowDetail(true);
          }}
        />
      ))}
      {showDetail && (
        <ProposalsPopup
          title="Beneficiary Proposals"
          data={beneficiary}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
export function useBarChartOptions() {
  const theme = useTheme();

  return useMemo(
    () => ({
      indexAxis: "y",
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
          displayColors: false,
          callbacks: {
            title: (items) => {
              const item = items[0];
              return `${item.label}`;
            },
            label: (item) => {
              const percentage = item.dataset.percentage[item.dataIndex];
              return `${formatNum(item.raw)} (${percentage})`;
            },
          },
        },
      },
      scales: {
        x: {
          border: {
            display: false,
          },
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          border: {
            display: false,
          },
          ticks: {
            display: false,
            font: {
              size: 12,
              weight: 500,
              style: "normal",
              lineHeight: "16px",
            },
            color: theme.textPrimary,
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    [theme],
  );
}

function BarChart({ categories, totalFiat }) {
  const chartRef = useRef(null);
  const barOptions = useBarChartOptions();
  const labelsRef = useRef(null);
  const { height: labelsHeight } = useElementRect(labelsRef);

  const labels = categories.map((item) => ({
    name: item.beneficiary,
    data: item,
    label: (
      <AddressUser
        add={item.beneficiary}
        className="text12Medium"
        noEvent={true}
      />
    ),
    value: item.totalPayoutFiatValue,
  }));

  const data = useMemo(() => {
    return {
      labels: categories.map((item) => item.beneficiary),
      datasets: [
        {
          data: categories.map((item) => item.totalPayoutFiatValue),
          percentage: categories.map(
            (item) =>
              ((item.totalPayoutFiatValue / totalFiat) * 100).toFixed(2) + "%",
          ),
          backgroundColor: "#3B82F6",
        },
      ],
    };
  }, [categories, totalFiat]);

  return (
    <div className="flex items-start gap-x-2">
      <div ref={labelsRef} className="pb-2" style={{ width: "140px" }}>
        <BarLabels labels={labels} />
      </div>
      <div
        className="flex-1"
        style={{
          height: labelsHeight || 0,
          overflow: "hidden",
          visibility: labelsHeight ? "visible" : "hidden",
        }}
      >
        <Bar ref={chartRef} data={data} options={barOptions} />
      </div>
    </div>
  );
}
