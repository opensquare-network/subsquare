import DemocracySummaryFooter from "next-common/components/summary/democracySummaryFooter";
import ListLayout from "../ListLayout";
import DemocracySummary from "next-common/components/summary/democracySummary";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useUser } from "next-common/context/user";

export default function DemocracyReferendaLayout({ summaryData, ...props }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const hasDemocracy = chainSettings.hasDemocracy !== false;
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);
  const user = useUser();

  return (
    <ListLayout
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      summary={<DemocracySummary summary={summaryData} />}
      summaryFooter={hasDemocracy && !isKintsugi && <DemocracySummaryFooter />}
      tabs={[
        { label: "Referenda", url: "/democracy/referenda" },
        !isKintsugi &&
          !chainSettings.noDemocracyModule &&
          user?.address && {
            label: "My Votes",
            url: "/democracy/votes",
          },
        { label: "Statistics", url: "/democracy/statistics" },
      ].filter(Boolean)}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
