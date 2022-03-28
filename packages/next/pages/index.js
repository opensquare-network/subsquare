import Overview from "components/overview";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "components/layout";
import {
  toCouncilMotionListItem,
  toDiscussionListItem,
  toExternalProposalListItem,
  toFinancialMotionsListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
  toTipListItem,
  toTreasuryBountyListItem,
  toTreasuryProposalListItem,
} from "utils/viewfuncs";

export default withLoginUserRedux(({ overview, loginUser, chain, siteUrl }) => {
  let overviewData = [
    {
      category: "Referenda",
      items: (overview?.democracy?.referendums ?? []).map((item) =>
        toReferendaListItem(chain, item)
      ),
    },
    {
      category: "Democracy External Proposals",
      items: (overview?.democracy?.externals ?? []).map((item) =>
        toExternalProposalListItem(chain, item)
      ),
    },
    {
      category: "Democracy Public Proposals",
      items: (overview?.democracy?.proposals ?? []).map((item) =>
        toPublicProposalListItem(chain, item)
      ),
    },
    {
      category: "Discussions",
      items: (overview?.discussions ?? []).map((item) =>
        toDiscussionListItem(chain, item)
      ),
    },
    {
      category: "Council Motions",
      items: (overview?.council?.motions ?? []).map((item) =>
        toCouncilMotionListItem(chain, item)
      ),
    },
    {
      category: "Tech. Comm. Proposals",
      items: (overview?.techComm?.motions ?? []).map((item) =>
        toTechCommMotionListItem(chain, item)
      ),
    },
    ...(chain === "karura" || chain === "acala"
      ? [
          {
            category: "Financial Council Motions",
            items: (overview?.financialCouncil?.motions ?? []).map((item) =>
              toFinancialMotionsListItem(chain, item)
            ),
          },
        ]
      : []),
    {
      category: "Treasury Proposals",
      items: (overview?.treasury?.proposals ?? []).map((item) =>
        toTreasuryProposalListItem(chain, item)
      ),
    },
    {
      category: "Treasury Bounties",
      items: (overview?.treasury?.bounties ?? []).map((item) =>
        toTreasuryBountyListItem(chain, item)
      ),
    },
    {
      category: "Tips",
      items: (overview?.treasury?.tips ?? []).map((item) =>
        toTipListItem(chain, item)
      ),
    },
  ];

  if (chain === "kabocha") {
    overviewData = [
      {
        category: "Discussions",
        items: (overview?.discussions ?? []).map((item) =>
          toDiscussionListItem(chain, item)
        ),
      },
    ];
  }

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
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
      <Overview overviewData={filteredOverviewData} chain={chain} />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { result } = await nextApi.fetch(`overview`);

  return {
    props: {
      chain,
      overview: result ?? null,
      siteUrl: process.env.SITE_URL,
    },
  };
});
