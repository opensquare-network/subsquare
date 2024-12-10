import { useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import normalizeCommunityTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeCommunityTreasuryProposalListItem";
import { useChainSettings } from "next-common/context/chain";
import {
  TreasuryProvider,
  useTreasuryProposalListUrl,
} from "next-common/context/treasury";
import NewTreasuryProposal from "next-common/components/treasury/proposal/newTreasuryProposal";

export default function ProposalsPage({ proposals: ssrProposals, chain }) {
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);

  const { showNewTreasuryProposalButton } = useChainSettings();

  const items = (proposals.items || []).map((item) =>
    normalizeCommunityTreasuryProposalListItem(chain, item),
  );

  const category = "Community Treasury Proposals";
  const seoInfo = { title: category, desc: category };

  const pallet = "communityTreasury";
  const treasuryProposalListUrl = useTreasuryProposalListUrl(pallet);

  return (
    <TreasuryProvider pallet={pallet}>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={<TreasurySummary />}
        tabs={[
          {
            value: "proposals",
            label: "Proposals",
            url: treasuryProposalListUrl,
          },
        ].filter(Boolean)}
      >
        <PostList
          category={category}
          title="List"
          titleExtra={
            showNewTreasuryProposalButton && (
              <div className="flex justify-end">
                <NewTreasuryProposal />
              </div>
            )
          }
          titleCount={proposals.total}
          items={items}
          pagination={{
            page: proposals.page,
            pageSize: proposals.pageSize,
            total: proposals.total,
          }}
        />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const proposals = await fetchList("community-treasury/proposals", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals,
      ...tracksProps,
    },
  };
});
