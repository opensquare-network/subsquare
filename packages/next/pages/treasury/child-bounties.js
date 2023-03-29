import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toTreasuryChildBountyListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ bounties, chain, tracks, fellowshipTracks }) => {
    const items = (bounties.items || []).map((item) =>
      toTreasuryChildBountyListItem(chain, item)
    );
    const category = "Treasury Child Bounties";
    const seoInfo = { title: category, desc: category };

    return (
      <HomeLayout
        seoInfo={seoInfo}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
      >
        <PostList
          category={category}
          create={null}
          items={items}
          summary={<Summary />}
          pagination={{
            page: bounties.page,
            pageSize: bounties.pageSize,
            total: bounties.total,
          }}
        />
      </HomeLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize, parentBountyId } = context.query;

  const [{ result: bounties }] = await Promise.all([
    nextApi.fetch("treasury/child-bounties", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
      parent: parentBountyId ?? "",
    }),
  ]);

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      chain,
      bounties: bounties ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
