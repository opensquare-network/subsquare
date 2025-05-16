import { withCommonProps } from "next-common/lib";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import PostList from "next-common/components/postList";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { TreasuryProvider } from "next-common/context/treasury";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import TreasurySpendFilter from "next-common/components/treasury/spends/treasurySpendFilter";
import { upperFirst } from "lodash-es";

export default function ProposalsPage({ spends: pagedSpends, chain }) {
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );
  const category = "Treasury Spends";
  const seoInfo = { title: category, desc: category };

  const treasurySummaryPanel = isPolkadotChain(chain) ? (
    <PolkadotTreasuryStatsOnProposal />
  ) : (
    <TreasurySummary />
  );

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={treasurySummaryPanel}
      >
        <DropdownUrlFilterProvider
          defaultFilterValues={{ status: "" }}
          shallow={false}
        >
          <PostList
            category={category}
            titleCount={total}
            items={spends}
            pagination={{ page, pageSize, total }}
            titleExtra={<TreasurySpendFilter />}
          />
        </DropdownUrlFilterProvider>
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { status } = context.query;
  const query = status ? { status: upperFirst(status) } : {};
  const spends = await fetchList("treasury/spends", context, query);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      spends,
      ...tracksProps,
    },
  };
});
