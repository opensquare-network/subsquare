import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import useCfgBasicData from "next-common/context/centrifuge/basicData";
import { useDailyExtrinsics } from "next-common/context/centrifuge/DailyExtrinsics";
import { bnToLocaleString } from "next-common/utils/bn";
import dayjs from "dayjs";
import Loading from "next-common/components/loading";
import { useThemeSetting } from "next-common/context/theme";
import LoadableContent from "next-common/components/common/loadableContent";

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
  const [{
    data: { signedExtrinsicCount = 0 } = {},
    loading: isLoadingBasicData,
  }] = useCfgBasicData();
  const { data: dailyExtrinsics = [], loading: isLoading } =
    useDailyExtrinsics();
  const themeSettings = useThemeSetting();

  const chartContent = (
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
              backgroundColor: themeSettings.theme500,
              barPercentage: 0.5,
            },
          ],
        }}
      />
    </div>
  );

  const loadingContent = (
    <div className="flex justify-center items-center grow w-full">
      <Loading size={24} />
    </div>
  );

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px] h-full">
        <CardHeader
          title="Transactions"
          value={
            <LoadableContent isLoading={isLoadingBasicData}>
              {bnToLocaleString(signedExtrinsicCount)}
            </LoadableContent>
          }
        />
        {isLoading ? loadingContent : chartContent}
      </div>
    </SecondaryCard>
  );
}
