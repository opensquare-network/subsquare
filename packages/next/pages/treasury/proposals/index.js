import { useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import {
  TreasuryProvider,
  useTreasuryProposalListUrl,
} from "next-common/context/treasury";
import NewTreasuryProposal from "next-common/components/treasury/proposal/newTreasuryProposal";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";

export default function ProposalsPage({ proposals: ssrProposals, chain }) {
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);
  const { integrations, showNewTreasuryProposalButton } = useChainSettings();

  const items = (proposals.items || []).map((item) =>
    normalizeTreasuryProposalListItem(chain, item),
  );

  const category = "Treasury Proposals";
  const seoInfo = { title: category, desc: category };

  const pallet = "treasury";
  const treasuryProposalListUrl = useTreasuryProposalListUrl(pallet);

  const treasurySummaryPanel = isPolkadotChain(chain) ? (
    <PolkadotTreasuryStatsOnProposal />
  ) : (
    <TreasurySummary />
  );

  return (
    <TreasuryProvider pallet={pallet}>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={treasurySummaryPanel}
        tabs={[
          {
            label: "Proposals",
            url: treasuryProposalListUrl,
          },
          integrations?.doTreasury && {
            label: "Statistics",
            url: `https://${chain}.dotreasury.com`,
          },
        ].filter(Boolean)}
      >
        <PostList
          titleExtra={
            showNewTreasuryProposalButton && (
              <div className="flex justify-end">
                <NewTreasuryProposal />
              </div>
            )
          }
          category={category}
          title="List"
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
  const proposals = await fetchList("treasury/proposals", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals,
      ...tracksProps,
    },
  };
});
