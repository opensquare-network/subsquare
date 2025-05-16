import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import {
  fellowshipReferendumsTrackApi,
  fellowshipReferendumsTracksApi,
  fellowshipReferendumsTracksSummaryApi,
  fellowshipTracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { startCase } from "lodash-es";
import { to404 } from "next-common/utils/serverSideUtil";
import ListLayout from "next-common/components/layout/ListLayout";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import Gov2TrackSummary from "next-common/components/summary/gov2TrackSummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NewFellowshipProposalButton from "next-common/components/summary/newFellowshipProposalButton";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipTrackSelect from "next-common/components/fellowship/fellowshipListLayout/trackSelect";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

export default function TrackPage({
  posts,
  title,
  fellowshipTracks,
  trackReferendaSummary,
  period,
}) {
  const chain = useChain();

  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <CollectivesProvider section="fellowship">
      <ListLayout
        seoInfo={seoInfo}
        title={`[${period.id}] Origin: ${period.origin}`}
        titleExtra={isCollectivesChain(chain) && <FellowshipTrackSelect />}
        description={period.description}
        summary={
          <Gov2TrackSummary
            summary={trackReferendaSummary}
            period={period}
            titleExtra={`[${period.id}]`}
          />
        }
      >
        <PostList
          title="List"
          titleCount={posts.total}
          titleExtra={<NewFellowshipProposalButton />}
          category={businessCategory.fellowship}
          items={items}
          pagination={{
            page: posts.page,
            pageSize: posts.pageSize,
            total: posts.total,
          }}
        />
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 1, page_size: pageSize = 50, id } = context.query;

  const tracksProps = await fetchOpenGovTracksProps();
  const { fellowshipTracks, summary } = tracksProps;
  let track = fellowshipTracks.find(
    (trackItem) => trackItem.id === parseInt(id),
  );
  if (!track) {
    track = fellowshipTracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [
    { result: posts },
    { result: trackReferendaSummary },
    { result: period },
    { result: fellowshipTracksDetail },
  ] = await Promise.all([
    backendApi.fetch(fellowshipReferendumsTrackApi(track?.id), {
      page,
      pageSize,
      simple: true,
    }),
    backendApi.fetch(fellowshipReferendumsTracksSummaryApi(track?.id)),
    backendApi.fetch(fellowshipReferendumsTracksApi(track?.id)),
    backendApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "Fellowship " + startCase(track.name),
      summary: summary ?? {},
      ...tracksProps,
      trackReferendaSummary: trackReferendaSummary ?? {},
      period: period ?? {},
      fellowshipTracksDetail: fellowshipTracksDetail ?? null,
    },
  };
});
