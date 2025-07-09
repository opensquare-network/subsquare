import { withCommonProps } from "next-common/lib";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import PostList from "next-common/components/postList/treasury/spends";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { TreasuryProvider } from "next-common/context/treasury";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import { upperFirst } from "lodash-es";
import businessCategory from "next-common/utils/consts/business/category";

export default function ProposalsPage({ spends: pagedSpends, chain }) {
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );
  const category = businessCategory.treasurySpends;
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
            titleCount={total}
            items={spends}
            pagination={{ page, pageSize, total }}
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
