import { useEffect, useState } from "react";
import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import { communityTreasuryProposalBaseUrl } from "next-common/utils/postBaseUrl";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";
import getTreasuryProposalTitle from "next-common/utils/viewfuncs/treasury/getTreasuryProposalTitle";

function normalizeTreasuryProposalListItem(chain, item) {
  return {
    ...item,
    title: getTreasuryProposalTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${communityTreasuryProposalBaseUrl}/${item.proposalIndex}`,
    value: item.onchainData?.value,
    index: item.proposalIndex,
  };
}

export default function ProposalsPage({ proposals: ssrProposals, chain }) {
  const [proposals, setProposals] = useState(ssrProposals);
  useEffect(() => setProposals(ssrProposals), [ssrProposals]);

  const items = (proposals.items || []).map((item) =>
    normalizeTreasuryProposalListItem(chain, item),
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
