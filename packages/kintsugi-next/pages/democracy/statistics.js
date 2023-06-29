import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import AllVotesStatistics from "components/statistics/democracy/allVoteStatistics";
import TurnoutStatistics from "components/statistics/democracy/turnoutStatistics";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";

export default withLoginUserRedux(({ turnout, summary }) => {
  const title = "Democracy Statistics";
  const seoInfo = { title, desc: title };

  return (
    <DemocracyReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={summary}
      summaryFooter={<KintsugiDemocracyStaking />}
    >
      <AllVotesStatistics turnout={turnout} />
      <TurnoutStatistics turnout={turnout} />
    </DemocracyReferendaLayout>
  );
});

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
