import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import DoughnutChart from "./doughnut/doughnutChart";
import useChartData from "./doughnut/useChartData";
import Indicators from "./indicators";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { BeneficiaryTooltipContent } from "./beneficiaryTooltipContent";

const ProposalsPopup = dynamicPopup(() => import("./proposalsPopup"));

function Chart({ curators, totalFiat }) {
  const [showDetail, setShowDetail] = useState(false);
  const [curator, setCurator] = useState({});
  const data = useChartData({ dataItems: curators, totalFiat });
  return (
    <div className="grid grid-cols-3 w-full items-center max-sm:grid-cols-1 max-sm:gap-y-4">
      <Summary totalFiat={totalFiat} />
      <Indicators
        data={data}
        isAddress={true}
        onClick={(index) => {
          setShowDetail(true);
          setCurator(curators[index]);
        }}
        TooltipContent={BeneficiaryTooltipContent}
      />
      <DoughnutChart data={data} />
      {showDetail && (
        <ProposalsPopup
          role="Curator"
          proposalOwner={curator.name}
          data={curator}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

export default function CuratorChart() {
  const { statistics } = usePageProps();
  const curators = Object.entries(statistics.curators).map(
    ([address, data]) => ({
      name: address,
      ...data,
    }),
  );
  const totalFiat = statistics.categories.curator?.totalPayoutFiatValue || 0;
  return (
    <div className="flex flex-col gap-y-4 p-4 py-6">
      <div className="text-textPrimary text14Bold">Curators</div>
      <div className="flex gap-x-6 gap-y-4 justify-start w-full max-sm:flex-col">
        <Chart curators={curators} totalFiat={totalFiat} />
      </div>
    </div>
  );
}
