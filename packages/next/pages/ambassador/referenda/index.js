import { withCommonProps } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  ambassadorReferendumsApi,
  ambassadorReferendumsSummaryApi,
  ambassadorTracksApi,
} from "next-common/services/url";
import ListLayout from "next-common/components/layout/ListLayout";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import normalizeAmbassadorReferendaListItem from "next-common/utils/gov2/list/normalizeAmbassadorReferendaListItem";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { isCollectivesChain } from "next-common/utils/chain";
import AmbassadorTrackSelect from "next-common/components/ambassador/ambassadorListLayout/trackSelect";
import { useChain } from "next-common/context/chain";

export default function AmbassadorReferendaPage({
  posts,
  ambassadorTracksDetail: detailedTracks,
  ambassadorSummary,
}) {
  const chain = useChain();
  const title = "Ambassador Referenda";
  const seoInfo = { title, desc: title };

  const items = (posts.items || []).map((item) =>
    normalizeAmbassadorReferendaListItem(item, detailedTracks),
  );

  return (
    <CollectivesProvider section="ambassador">
      <ListLayout
        seoInfo={seoInfo}
        title={title}
        description="All active and history ambassador referenda in various tracks."
        summary={<Gov2Summary summary={ambassadorSummary} />}
        titleExtra={isCollectivesChain(chain) && <AmbassadorTrackSelect />}
      >
        <PostList
          title="List"
          titleCount={posts.total}
          category={businessCategory.ambassadorReferenda}
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
  const { page = 1, page_size: pageSize = defaultPageSize } = context.query;

  const [
    tracksProps,
    { result: posts },
    { result: ambassadorSummary },
    { result: ambassadorTracksDetail },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(ambassadorReferendumsApi, {
      page,
      pageSize,
      simple: true,
    }),
    nextApi.fetch(ambassadorReferendumsSummaryApi),
    nextApi.fetch(ambassadorTracksApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      ambassadorTracksDetail: ambassadorTracksDetail ?? null,
      ambassadorSummary: ambassadorSummary ?? {},
      ...tracksProps,
    },
  };
});
