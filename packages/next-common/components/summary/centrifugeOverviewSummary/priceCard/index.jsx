import {
  TIME_RANGE,
  useTokenPrices,
} from "next-common/context/centrifuge/tokenPrices";
import PriceCardContent from "./content";

const OPTIONS = [
  {
    label: "7d",
    value: TIME_RANGE.DAY_7,
    chartOptions: {
      scales: {
        x: {
          time: {
            unit: "day",
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  },
  {
    label: "1M",
    value: TIME_RANGE.DAY_30,
    chartOptions: {
      scales: {
        x: {
          time: {
            unit: "day",
          },
          ticks: {
            stepSize: 2,
          },
        },
      },
    },
  },
  {
    label: "3M",
    value: TIME_RANGE.DAY_90,
    chartOptions: {
      scales: {
        x: {
          time: {
            unit: "day",
          },
          ticks: {
            stepSize: 5,
          },
        },
      },
    },
  },
  {
    label: "1Y",
    value: TIME_RANGE.DAY_365,
    chartOptions: {
      scales: {
        x: {
          time: {
            unit: "day",
          },
          ticks: {
            stepSize: 22,
          },
        },
      },
    },
  },
];

export default function PriceCard() {
  const { data, loading, range, setRange } = useTokenPrices();

  return (
    <PriceCardContent
      data={data}
      loading={loading}
      range={range}
      setRange={setRange}
      options={OPTIONS}
    />
  );
}
