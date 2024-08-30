import { useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import normalizeCommunityTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeCommunityTreasuryProposalListItem";
import NewTreasuryProposalButton from "next-common/components/treasury/proposal/newTreasuryProposalButton";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";
import { getEventData } from "next-common/utils/sendTransaction";

export default function ProposalsPage({ proposals: ssrProposals, chain }) {
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);

  const router = useRouter();
  const { showNewTreasuryProposalButton } = useChainSettings();

  const items = (proposals.items || []).map((item) =>
    normalizeCommunityTreasuryProposalListItem(chain, item),
  );

  const category = "Community Treasury Proposals";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasurySummary />}
      tabs={[
        {
          label: "Proposals",
          url: "/community-treasury/proposals",
        },
      ].filter(Boolean)}
    >
      <PostList
        category={category}
        title="List"
        titleExtra={
          showNewTreasuryProposalButton && (
            <div className="flex justify-end">
              <NewTreasuryProposalButton
                treasuryPallet="communityTreasury"
                onInBlock={(events) => {
                  const eventData = getEventData(
                    events,
                    "communityTreasury",
                    "Proposed",
                  );
                  if (!eventData) {
                    return;
                  }
                  const [proposalIndex] = eventData;
                  router.push(`/community-treasury/proposals/${proposalIndex}`);
                }}
              />
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
