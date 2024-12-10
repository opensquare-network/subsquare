import DemocracySummaryFooter from "next-common/components/summary/democracySummaryFooter";
import ListLayout from "../ListLayout";
import DemocracySummary from "next-common/components/summary/democracySummary";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { useUser } from "next-common/context/user";

export default function DemocracyReferendaLayout({ summaryData, ...props }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);
  const user = useUser();
  const {
    modules: { democracy },
  } = chainSettings;

  const hasDemocracyModule = democracy && !democracy?.archived;

  return (
    <ListLayout
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      summary={<DemocracySummary summary={summaryData} />}
      summaryFooter={
        hasDemocracyModule && !isKintsugi && <DemocracySummaryFooter />
      }
      tabs={[
        {
          label: "Referenda",
          value: "referenda",
          url: "/democracy/referenda",
        },
        !isKintsugi &&
          hasDemocracyModule &&
          user?.address && {
            label: "My Votes",
            value: "my_votes",
            url: "/democracy/votes",
          },
        {
          label: "Statistics",
          value: "statistics",
          url: "/democracy/statistics",
        },
      ].filter(Boolean)}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
