import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toTreasuryChildBountyListItem } from "utils/viewfuncs";
import { useChainSettings } from "next-common/context/chain";
import { lowerCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(({ bounties, chain }) => {
  const chainSettings = useChainSettings();

  const items = (bounties.items || []).map((item) =>
    toTreasuryChildBountyListItem(chain, item),
  );
  const category = "Treasury Child Bounties";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySummary />}
      tabs={[
        {
          label: "Child Bounties",
          url: "/treasury/child-bounties",
        },
        chainSettings.hasDotreasury && {
          label: "Statistics",
          url: `https://dotreasury.com/${lowerCase(
            chainSettings.symbol,
          )}/child-bounties`,
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

  const { page, page_size: pageSize, parentBountyId } = context.query;

  const [{ result: bounties }] = await Promise.all([
    nextApi.fetch("treasury/child-bounties", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
      parent: parentBountyId ?? "",
    }),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      chain,
      bounties: bounties ?? EmptyList,
      ...tracksProps,
    },
  };
});
