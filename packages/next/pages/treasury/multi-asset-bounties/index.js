import MultiAssetBountiesPostList from "next-common/components/postList/multiAssetBountiesPostList";
import { withCommonProps } from "next-common/lib";
import normalizeMultiAssetBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeMultiAssetBountyListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import { backendApi } from "next-common/services/nextApi";
import { fetchList } from "next-common/services/list";
import businessCategory from "next-common/utils/consts/business/category";
import MultiAssetBountyCardSection from "next-common/components/treasury/multiAssetBounty/bountyCardSection";

export default function MultiAssetBountiesPage({
  activeBounties,
  inactiveBounties,
  chain,
}) {
  const items = (inactiveBounties.items || []).map((item) =>
    normalizeMultiAssetBountyListItem(chain, item),
  );
  const activeItems = (activeBounties || []).map((item) =>
    normalizeMultiAssetBountyListItem(chain, item),
  );
  const category = businessCategory.multiAssetBounties;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        tabs={[
          {
            value: "multi-asset-bounties",
            label: "Multi-Asset Bounties",
            url: "/treasury/multi-asset-bounties",
          },
        ]}
      >
        {activeItems.length > 0 && (
          <MultiAssetBountyCardSection activeBounties={activeItems} />
        )}
        <MultiAssetBountiesPostList
          titleCount={inactiveBounties.total}
          items={items}
          pagination={{
            page: inactiveBounties.page,
            pageSize: inactiveBounties.pageSize,
            total: inactiveBounties.total,
          }}
        />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [tracksProps, { result: activeBounties }, inactiveBounties] =
    await Promise.all([
      fetchOpenGovTracksProps(),
      backendApi.fetch("/treasury/multi-asset-bounties/active"),
      fetchList("/treasury/multi-asset-bounties/inactive", context),
    ]);

  return {
    props: {
      activeBounties,
      inactiveBounties,
      ...tracksProps,
    },
  };
});
