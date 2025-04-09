import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";
import { useNavCollapsed } from "next-common/context/nav";
import { Header } from "next-common/components/statistics/styled";
import { cn } from "next-common/utils";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const VoteTrend = dynamicClientOnly(() =>
  import("components/statistics/democracy/voteTrend"),
);
const AddressTrend = dynamicClientOnly(() =>
  import("components/statistics/democracy/addressTrend"),
);
const TurnoutStatistics = dynamicClientOnly(() =>
  import("components/statistics/democracy/turnoutStatistics"),
);

export default function DemocracyStatisticsPage({ turnout, summary }) {
  const title = "Democracy Statistics";
  const seoInfo = { title, desc: title };
  const [navCollapsed] = useNavCollapsed();

  return (
    <DemocracyReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={summary}
      summaryFooter={<KintsugiDemocracyStaking />}
    >
      <div className="space-y-6">
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <div
            className={cn(
              "grid grid-cols-2 gap-4",
              !navCollapsed ? "max-md:grid-cols-1" : "max-sm:grid-cols-1",
            )}
          >
            <VoteTrend turnout={turnout} />
            <AddressTrend turnout={turnout} />
            <TurnoutStatistics turnout={turnout} />
          </div>
        </div>
      </div>
    </DemocracyReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [{ result: turnout }, { result: summary }] = await Promise.all([
    nextApi.fetch("democracy/referenda/turnout"),
    nextApi.fetch("overview/summary"),
  ]);

  return {
    props: {
      turnout: turnout ?? [],
      summary: summary ?? {},
    },
  };
});
