import React from "react";
import Overview from "next-common/components/overview";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  toDiscussionListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
  toTreasuryProposalListItem,
} from "utils/viewfuncs";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ overview, loginUser, chain }) => {
  let overviewData = [
    {
      category: "Discussions",
      items: (overview?.discussions ?? []).map((item) =>
        toDiscussionListItem(chain, item)
      ),
    },
    {
      category: "Treasury Proposals",
      items: (overview?.treasury?.proposals ?? []).map((item) =>
        toTreasuryProposalListItem(chain, item)
      ),
    },
    {
      category: "Tech. Comm. Proposals",
      items: (overview?.techComm?.motions ?? []).map((item) =>
        toTechCommMotionListItem(chain, item)
      ),
    },
    {
      category: "Referenda",
      items: (overview?.democracy?.referendums ?? []).map((item) =>
        toReferendaListItem(chain, item)
      ),
    },
    {
      category: "Democracy Public Proposals",
      items: (overview?.democracy?.proposals ?? []).map((item) =>
        toPublicProposalListItem(chain, item)
      ),
    },
  ];

  const filteredOverviewData = overviewData.filter(
    (data) => data?.items?.length > 0 || data?.category === "Discussions"
  );

  // Sort the items with length = 0 to the end of the list
  filteredOverviewData.sort((a, b) =>
    a?.items?.length > 0 && b?.items?.length > 0
      ? 0
      : b?.items?.length - a?.items?.length
  );

  return (
    <HomeLayout user={loginUser}>
      <Overview overviewData={filteredOverviewData} chain={chain} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { result, error } = await nextApi.fetch(`overview`);

  return {
    props: {
      chain,
      overview: result ?? null,
    },
  };
});
