import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import ReferendaStatistics from "next-common/components/statistics/referenda";
import ReferendaSummary from "next-common/components/statistics/referenda/summary";
import OpenGovTurnoutSummary from "next-common/components/statistics/referenda/turnoutSummary";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ tracksStats, delegatee, summary, referendumsSummary }) => {
    const title = "OpenGov Statistics";
    const seoInfo = { title, desc: title };

    return (
      <ReferendaLayout
        seoInfo={seoInfo}
        title={title}
        summaryData={referendumsSummary}
      >
        <ReferendaSummary summary={summary} />
        <OpenGovTurnoutSummary summary={summary} />
        <ReferendaStatistics tracks={tracksStats} delegatee={delegatee} />
      </ReferendaLayout>
    );
  },
);

export const getServerSideProps = withLoginUser(async (context) => {
  const [
    { result: tracksStats },
    { result: delegatee },
    { result: summary },
    { result: referendumsSummary },
  ] = await Promise.all([
    ssrNextApi.fetch("referenda/tracks"),
    ssrNextApi.fetch("referenda/delegatee", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch("referenda/summary"),
    ssrNextApi.fetch(gov2ReferendumsSummaryApi),
  ]);

  return {
    props: {
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      summary: summary ?? [],
      referendumsSummary: referendumsSummary ?? {},
    },
  };
});
