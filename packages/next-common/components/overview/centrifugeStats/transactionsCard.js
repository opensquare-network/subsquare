import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useBasicData } from "next-common/context/centrifuge/basicData";
import { useDailyExtrinsics } from "next-common/context/centrifuge/DailyExtrinsics";
import { formatBN } from "next-common/utils/bn";
import dayjs from "dayjs";

function BarChart({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default function TransactionsCard() {
  const { data: { signedExtrinsicCount = 0 } = {} } = useBasicData();
  const { data: dailyExtrinsics = [] } = useDailyExtrinsics();

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardHeader
          title="Transaction"
          value={formatBN(signedExtrinsicCount)}
        />
        <div className="relative h-[72px]">
          <BarChart
            data={{
              labels: dailyExtrinsics.map((extrinsic, index) => {
                const label = dayjs(extrinsic.startTime * 1000).format(
                  "YYYY-MM-DD HH:mm",
                );

                if (index === dailyExtrinsics.length - 1) {
                  return label + " ~ now";
                } else {
                  return (
                    label +
                    " ~ " +
                    dayjs(dailyExtrinsics[index + 1].startTime * 1000).format(
                      "YYYY-MM-DD HH:mm",
                    )
                  );
                }
              }),
              datasets: [
                {
                  label: "Signed extrinsics",
                  data: dailyExtrinsics.map((extrinsic) => extrinsic.count),
                  backgroundColor: "#1253FF",
                  barPercentage: 0.5,
                },
              ],
            }}
          />
        </div>
      </div>
    </SecondaryCard>
  );
}
