import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { useChainSettings } from "next-common/context/chain";
import { lowerCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";

export default withLoginUserRedux(({ bounties, chain }) => {
  const chainSettings = useChainSettings();

  const items = (bounties.items || []).map((item) =>
    normalizeBountyListItem(chain, item),
  );
  const category = "Treasury Bounties";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySummary />}
      tabs={[
        {
          label: "Bounties",
          url: "/treasury/bounties",
        },
        chainSettings.hasDotreasury && {
          label: "Statistics",
          url: `https://dotreasury.com/${lowerCase(
            chainSettings.symbol,
          )}/bounties`,
        },
      ].filter(Boolean)}
    >
      <PostList
        category={category}
        title="List"
        titleCount={bounties.total}
        items={items}
        pagination={{
          page: bounties.page,
          pageSize: bounties.pageSize,
          total: bounties.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: bounties }] = await Promise.all([
    nextApi.fetch("treasury/bounties", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
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
