import { withCommonProps } from "next-common/lib";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipTreasurySummary from "next-common/components/summary/treasurySummary/fellowshipTreasurySummary";
import FellowShipTreasurySpendsPostList from "next-common/components/postList/fellowshipTreasurySpendsPostList";
import { normalizeFellowshipTreasurySpendListItem } from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { TreasuryProvider } from "next-common/context/treasury";
import businessCategory from "next-common/utils/consts/business/category";

export default function ProposalsPage({ spends: pagedSpends, chain }) {
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeFellowshipTreasurySpendListItem(chain, item),
  );
  const category = businessCategory.fellowshipTreasurySpends;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider pallet="fellowshipTreasury">
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={<FellowshipTreasurySummary />}
      >
        <FellowShipTreasurySpendsPostList
          category={category}
          titleCount={total}
          items={spends}
          pagination={{ page, pageSize, total }}
        />
      </ListLayout>
    </TreasuryProvider>
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
