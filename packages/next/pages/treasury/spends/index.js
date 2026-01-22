import { withCommonProps } from "next-common/lib";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySpendsPostList from "next-common/components/postList/treasurySpendsPostList";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { TreasuryProvider } from "next-common/context/treasury";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import { upperFirst } from "lodash-es";
import businessCategory from "next-common/utils/consts/business/category";
import TreasurySpendsSummary from "next-common/components/summary/treasurySpendsSummary";
import TreasurySpendsPendingNotice from "next-common/components/treasury/spends/treasurySpendsPendingNotice";

export default function ProposalsPage({ spends: pagedSpends, chain }) {
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );
  const category = businessCategory.treasurySpends;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={<TreasurySpendsSummary />}
        summaryFooter={<TreasurySpendsPendingNotice />}
      >
        <DropdownUrlFilterProvider
          defaultFilterValues={{ status: "" }}
          shallow={false}
        >
          <TreasurySpendsPostList
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
  const [spends, tracksProps] = await Promise.all([
    await fetchList("treasury/spends", context, query),
    await fetchOpenGovTracksProps(),
  ]);

  return {
    props: {
      spends,
      ...tracksProps,
    },
  };
});
