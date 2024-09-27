import { withCommonProps } from "next-common/lib";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipTreasurySummary from "next-common/components/summary/treasurySummary/fellowshipTreasurySummary";
import PostList from "next-common/components/postList";
import { normalizeFellowshipTreasurySpendListItem } from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { TreasuryProvider } from "next-common/context/treasury";
import { AssetHubProvider } from "next-common/context/assetHub";

export default function ProposalsPage({ spends: pagedSpends, chain }) {
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeFellowshipTreasurySpendListItem(chain, item),
  );
  const category = "Fellowship Treasury Spends";
  const seoInfo = { title: category, desc: category };

  return (
    <AssetHubProvider>
      <TreasuryProvider pallet="fellowshipTreasury">
        <ListLayout
          seoInfo={seoInfo}
          title={category}
          summary={<FellowshipTreasurySummary />}
        >
          <PostList
            category={category}
            titleCount={total}
            items={spends}
            pagination={{ page, pageSize, total }}
          />
        </ListLayout>
      </TreasuryProvider>
    </AssetHubProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const spends = await fetchList("fellowship/treasury/spends", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      spends,
      ...tracksProps,
    },
  };
});
