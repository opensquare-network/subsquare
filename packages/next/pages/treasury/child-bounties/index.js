import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import { toTreasuryChildBountyListItem } from "utils/viewfuncs";
import { useChainSettings } from "next-common/context/chain";
import { lowerCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default function ChildBountiesPage({ bounties }) {
  const chainSettings = useChainSettings();

  const items = (bounties.items || []).map((item) =>
    toTreasuryChildBountyListItem(item),
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
}

export const getServerSideProps = withCommonProps(async (context) => {
  const bounties = await fetchList("treasury/child-bounties", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      bounties,
      ...tracksProps,
    },
  };
});
