import ChainInfo from "next-common/components/chain/info";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";

export default function OverviewHead({ summaryData }) {
  const chain = useChain();

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  return (
    <div className="p-6">
      <ChainInfo />

      <hr className="h-px my-4 bg-neutral300" />

      <div>
        <SummaryComponent summaryData={summaryData} />
      </div>
    </div>
  );
}
