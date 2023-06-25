import { SummaryGreyText } from "next-common/components/summary/styled";
import Summary from "next-common/components/summary/v2/base";
import { useChainSettings } from "next-common/context/chain";
import CountDown from "next-common/components/summary/countDown";
import DemocracySummaryFooter from "next-common/components/summary/democracySummaryFooter";

export default function DemocracySummary({ summary = {} }) {
  const chainSettings = useChainSettings();
  const hasDemocracy = chainSettings.hasDemocracy !== false;

  return (
    <Summary
      items={[
        {
          title: "Proposals",
          content: (
            <span>
              {summary.publicProposals?.active || 0}
              <SummaryGreyText>
                {" "}
                / {summary.publicProposals?.all || 0}
              </SummaryGreyText>
            </span>
          ),
        },
        {
          title: "Referenda",
          content: (
            <span>
              {summary.referenda?.active || 0}
              <SummaryGreyText>
                {" "}
                / {summary.referenda?.all || 0}
              </SummaryGreyText>
            </span>
          ),
        },
        hasDemocracy && {
          title: "Launch Period",
          content: (
            <>
              {(summary?.launchPeriod || []).map((item, index) => (
                <span className={index % 2 === 1 ? "unit" : ""} key={index}>
                  {item}
                </span>
              ))}
              {(summary?.totalPeriod || []).map((item, index) => (
                <span
                  className={index % 2 === 1 ? "unit total" : "total"}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </>
          ),
          suffix: <CountDown percent={summary?.progress ?? 0} />,
        },
      ].filter(Boolean)}
      footer={hasDemocracy && <DemocracySummaryFooter />}
    />
  );
}
