import React from "react";
import OverviewPostList from "next-common/components/overview/postList";
import OverviewHead from "next-common/components/overview/head";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toDiscussionListItem } from "utils/viewfuncs";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";

export default withLoginUserRedux(({ overview, chain }) => {
  let overviewData = [
    {
      category: "Discussions",
      link: "/discussions",
      items: (overview?.discussions ?? []).map((item) =>
        toDiscussionListItem(chain, item),
      ),
    },
    {
      category: "Referenda",
      link: "/democracy/referenda",
      items: (overview?.democracy?.referenda ?? []).map((item) =>
        normalizeReferendaListItem(chain, item),
      ),
    },
    {
      category: "Democracy Public Proposals",
      link: "/democracy/proposals",
      items: (overview?.democracy?.proposals ?? []).map((item) =>
        normalizeProposalListItem(chain, item),
      ),
    },
    {
      category: "Treasury Proposals",
      link: "/treasury/proposals",
      items: (overview?.treasury?.proposals ?? []).map((item) =>
        normalizeTreasuryProposalListItem(chain, item),
      ),
    },
    {
      category: "Tech. Comm. Proposals",
      link: "/techcomm/proposals",
      items: (overview?.techComm?.motions ?? []).map((item) =>
        normalizeTechCommMotionListItem(chain, item),
      ),
    },
  ];

  const filteredOverviewData = overviewData.filter(
    (data) => data?.items?.length > 0 || data?.category === "Discussions",
  );

  // Sort the items with length = 0 to the end of the list
  filteredOverviewData.sort((a, b) =>
    a?.items?.length > 0 && b?.items?.length > 0
      ? 0
      : b?.items?.length - a?.items?.length,
  );

  return (
    <ListLayout head={<OverviewHead summaryData={overview?.summary} />}>
      <OverviewPostList overviewData={filteredOverviewData} />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  const chain = process.env.CHAIN;
  const { result } = await nextApi.fetch("overview");

  return {
    props: {
      chain,
      overview: result ?? null,
    },
  };
});
