import useCfgTokenPrices, { TIME_RANGE } from "next-common/context/centrifuge/tokenPrices";
import PriceCardContent from "./content";

function getChartOptions(stepSize) {
  return {
    scales: {
      x: {
        time: {
          unit: "day",
        },
        ticks: {
          stepSize,
        },
      },
    },
  };
}

const OPTIONS = [
  {
    label: "7d",
    value: TIME_RANGE.DAY_7,
    chartOptions: getChartOptions(1),
  },
  {
    label: "1M",
    value: TIME_RANGE.DAY_30,
    chartOptions: getChartOptions(2),
  },
  {
    label: "3M",
    value: TIME_RANGE.DAY_90,
    chartOptions: getChartOptions(5),
  },
  {
    label: "1Y",
    value: TIME_RANGE.DAY_365,
    chartOptions: getChartOptions(22),
  },
  {
    label: "All",
    value: TIME_RANGE.DAY_ALL,
    chartOptions: getChartOptions(60),
  },
];

export default function PriceCard() {
  const [{ data, loading, range, setRange }] = useCfgTokenPrices();

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
