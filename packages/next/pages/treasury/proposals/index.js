import { useEffect, useState } from "react";
import TreasuryProposalsPostList, {
  NewTreasuryProposalButton,
} from "next-common/components/postList/treasuryProposalsPostList";
import { withCommonProps } from "next-common/lib";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import { TreasuryProvider } from "next-common/context/treasury";
import businessCategory from "next-common/utils/consts/business/category";
import TreasurySummaryPanel from "../statistics/summaryPanel";
import useLayoutTabs from "next-common/hooks/treasury/proposal/useLayoutTabs";

const pallet = "treasury";

export default function ProposalsPage({ proposals: ssrProposals, chain }) {
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);
  const tabs = useLayoutTabs(pallet);

  const items = (proposals.items || []).map((item) =>
    normalizeTreasuryProposalListItem(chain, item),
  );

  const category = businessCategory.treasuryProposals;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider pallet={pallet}>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={<TreasurySummaryPanel />}
        tabs={tabs}
      >
        <TreasuryProposalsPostList
          titleCount={proposals.total}
          items={items}
          pagination={{
            page: proposals.page,
            pageSize: proposals.pageSize,
            total: proposals.total,
          }}
          titleExtra={<NewTreasuryProposalButton />}
        />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const proposals = await fetchList("treasury/proposals", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals,
      ...tracksProps,
    },
  };
});
