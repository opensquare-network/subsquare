import TreasuryChildBountiesPostList from "next-common/components/postList/treasuryChildBountiesPostList";
import { withCommonProps } from "next-common/lib";
import { toTreasuryChildBountyListItem } from "next-common/utils/viewfuncs";
import { isNil, upperFirst } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import { TreasuryProvider } from "next-common/context/treasury";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import TreasuryChildBountiesSummary from "next-common/components/summary/treasuryChildBountiesSummary";

export default function ChildBountiesPage({ bounties }) {
  const items = (bounties.items || []).map((item) =>
    toTreasuryChildBountyListItem(item),
  );
  const category = "Treasury Child Bounties";
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={<TreasuryChildBountiesSummary />}
        tabs={[
          {
            value: "child_bounties",
            label: "Child Bounties",
            url: "/treasury/child-bounties",
          },
        ].filter(Boolean)}
      >
        <DropdownUrlFilterProvider
          defaultFilterValues={{ status: "" }}
          shallow={false}
        >
          <TreasuryChildBountiesPostList
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
    "treasury/child-bounties",
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
