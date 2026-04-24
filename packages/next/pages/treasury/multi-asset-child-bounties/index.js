import MultiAssetChildBountiesPostList from "next-common/components/postList/multiAssetChildBountiesPostList";
import { withCommonProps } from "next-common/lib";
import normalizeMultiAssetChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeMultiAssetChildBountyListItem";
import { isNil, upperFirst } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import { TreasuryProvider } from "next-common/context/treasury";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import businessCategory from "next-common/utils/consts/business/category";

export default function MultiAssetChildBountiesPage({ bounties, chain }) {
  const items = (bounties.items || []).map((item) =>
    normalizeMultiAssetChildBountyListItem(chain, item),
  );
  const category = businessCategory.multiAssetChildBounties;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        tabs={[
          {
            value: "multi-asset-child-bounties",
            label: "Child Bounties",
            url: "/treasury/multi-asset-child-bounties",
          },
        ]}
      >
        <DropdownUrlFilterProvider
          defaultFilterValues={{ status: "" }}
          shallow={false}
        >
          <MultiAssetChildBountiesPostList
            titleCount={bounties.total}
            items={items}
            pagination={{
              page: bounties.page,
              pageSize: bounties.pageSize,
              total: bounties.total,
            }}
          />
        </DropdownUrlFilterProvider>
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { parentBountyId, status } = context.query;
  const params = {};
  if (!isNil(parentBountyId)) {
    params.parent = parentBountyId;
  }

  if (status) {
    params.status = upperFirst(status);
  }

  const bounties = await fetchList(
    "treasury/multi-asset-child-bounties",
    context,
    Object.keys(params).length > 0 ? params : null,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      bounties,
      ...tracksProps,
    },
  };
});
