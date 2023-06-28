import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import ReferendaStatistics from "next-common/components/statistics/referenda";
import ReferendaSummary from "next-common/components/statistics/referenda/summary";
import OpenGovTurnoutSummary from "next-common/components/statistics/referenda/turnoutSummary";
import ListLayout from "next-common/components/layout/ListLayout";

export default withLoginUserRedux(({ tracksStats, delegatee, summary }) => {
  const title = "OpenGov Statistics";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="All active and history referenda of various tracks."
      tabs={[
        { label: "Referenda", url: "/referenda" },
        { label: "Statistics", url: "/referenda/statistics" },
      ]}
    >
      <ReferendaSummary summary={summary} />
      <OpenGovTurnoutSummary summary={summary} />
      <ReferendaStatistics tracks={tracksStats} delegatee={delegatee} />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracksStats }, { result: delegatee }, { result: summary }] =
    await Promise.all([
      ssrNextApi.fetch("referenda/tracks"),
      ssrNextApi.fetch("referenda/delegatee", {
        sort: JSON.stringify(["votes", "desc"]),
        pageSize: 25,
      }),
      ssrNextApi.fetch("referenda/summary"),
    ]);

  return {
    props: {
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      summary: summary ?? [],
    },
  };
});
