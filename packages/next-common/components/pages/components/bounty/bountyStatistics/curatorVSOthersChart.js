import { omit } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import DoughnutChart from "./doughnut/doughnutChart";
import useChartData from "./doughnut/useChartData";
import Indicators from "./indicators";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useMemo, useState } from "react";

const ProposalsPopup = dynamicPopup(() => import("./proposalsPopup"));

export default function CuratorVSOthersChart() {
  const { statistics } = usePageProps();
  const totalCuratorFiat = Number(
    statistics.categories.curator?.totalPayoutFiatValue || 0,
  );
  const totalOthersFiat = Object.values(
    omit(statistics.categories, "curator"),
  ).reduce((acc, category) => acc + Number(category.totalPayoutFiatValue), 0);
  const totalFiat = totalCuratorFiat + totalOthersFiat;

  const categories = useMemo(
    () => [
      {
        name: "Curator",
        totalPayoutFiatValue: totalCuratorFiat,
        childBounties: statistics.categories.curator?.childBounties || [],
      },
      {
        name: "Others",
        totalPayoutFiatValue: totalOthersFiat,
        childBounties: Object.values(
          omit(statistics.categories, "curator"),
        ).flatMap((category) => category.childBounties || []),
      },
    ],
    [statistics.categories, totalCuratorFiat, totalOthersFiat],
  );

  return (
    <div className="flex flex-col gap-y-4 p-4 py-6">
      <div className="text-textPrimary text14Bold">All</div>
      <div className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
        <Chart categories={categories} totalFiat={totalFiat} />
      </div>
    </div>
  );
}

function Chart({ categories, totalFiat }) {
  const [showDetail, setShowDetail] = useState(false);
  const [category, setCategory] = useState({});
  const data = useChartData({ dataItems: categories, totalFiat });
  return (
    <div className="grid grid-cols-3 w-full items-center max-sm:grid-cols-1 max-sm:gap-y-4">
      <Summary totalFiat={totalFiat} />
      <Indicators
        data={data}
        onClick={(index) => {
          setShowDetail(true);
          setCategory(categories[index]);
        }}
      />
      <DoughnutChart data={data} />
      {showDetail && (
        <ProposalsPopup
          role={category.name}
          data={category}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
