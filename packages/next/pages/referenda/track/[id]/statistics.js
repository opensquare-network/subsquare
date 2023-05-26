import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { gov2TracksApi } from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import startCase from "lodash.startcase";
import TrackStatistics from "next-common/components/statistics/track";
import { EmptyList } from "next-common/utils/constants";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { to404 } from "next-common/utils/serverSideUtil";

export default withLoginUserRedux(
  ({
    track,
    turnout,
    delegatee,
    delegators,
    summary,
  }) => {
    return (
      <DetailLayout
        seoInfo={{
          title: "OpenGov Statistics",
          desc: "OpenGov Statistics",
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb
            items={[
              {
                path: "/referenda",
                content: "Referenda",
              },
              {
                path: `/referenda/track/${track.id}`,
                content: `[${track.id}] ${startCase(track.name)}`,
              },
              {
                content: "Statistics",
              },
            ]}
          />
        </BreadcrumbWrapper>
        <TrackStatistics
          track={track}
          turnout={turnout}
          delegatee={delegatee}
          delegators={delegators}
          summary={summary}
        />
      </DetailLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [
    { result: turnout },
    { result: delegatee },
    { result: delegators },
    { result: summary },
  ] = await Promise.all([
    ssrNextApi.fetch(`referenda/tracks/${id}/turnout`),
    ssrNextApi.fetch(`referenda/tracks/${id}/delegatee`, {
      sort: JSON.stringify(["delegatedVotes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch(`referenda/tracks/${id}/delegators`, {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch(`referenda/tracks/${id}/summary`),
  ]);

  return {
    props: {
      track: track ?? {},
      turnout: turnout ?? [],
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
