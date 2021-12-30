import Overview from "components/overview";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
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
import SEO from "components/SEO";

export default withLoginUserRedux(({ overview, loginUser, chain, siteUrl }) => {
  const overviewData = [
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
    {
      category: "Financial Council Motions",
      items: (overview?.financialMotions?.motions ?? []).map((item) =>
        toFinancialMotionsListItem(chain, item)
      ),
    },
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
      category: "Referenda",
      items: (overview?.democracy?.referendums ?? []).map((item) =>
        toReferendaListItem(chain, item)
      ),
    },
    {
      category: "Tips",
      items: (overview?.treasury?.tips ?? []).map((item) =>
        toTipListItem(chain, item)
      ),
    },
    {
      category: "Democracy Public Proposals",
      items: (overview?.democracy?.proposals ?? []).map((item) =>
        toPublicProposalListItem(chain, item)
      ),
    },
    {
      category: "Democracy External Proposals",
      items: (overview?.democracy?.externals ?? []).map((item) =>
        toExternalProposalListItem(chain, item)
      ),
    },
  ];

  // Sort the items with length = 0 to the end of the list
  overviewData.sort((a, b) =>
    a.items.length > 0 && b.items.length > 0
      ? 0
      : b.items.length - a.items.length
  );

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
      <SEO
        title={`SubSquare`}
        desc={`SubSquare`}
        siteUrl={siteUrl}
        chain={chain}
      />
      <Overview overviewData={overviewData} chain={chain} />
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
