import { withLoginUser } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import TurnoutStatistics from "components/statistics/democracy/turnoutStatistics";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";
import { useNavCollapsed } from "next-common/context/nav";
import VoteTrend from "components/statistics/democracy/voteTrend";
import AddressTrend from "components/statistics/democracy/addressTrend";
import { Header } from "next-common/components/statistics/styled";
import clsx from "clsx";

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
            className={clsx(
              "flex gap-4 flex-wrap",
              "[&_>_div]:min-w-[calc(50%-16px)] [&_>_div]:max-w-[calc(50%-8px)] [&_>_div]:flex-1",
              !navCollapsed ? "max-md:flex-col" : "max-sm:flex-col",
              !navCollapsed
                ? "[&_>_div]:max-md:max-w-full"
                : "[&_>_div]:max-sm:max-w-full",
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

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: turnout }, { result: summary }] = await Promise.all([
    nextApi.fetch("democracy/referenda/turnout"),
    nextApi.fetch("summary"),
  ]);

  return {
    props: {
      turnout: turnout ?? [],
      summary: summary ?? {},
    },
  };
});
