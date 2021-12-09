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
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
  toTipListItem,
  toTreasuryBountyListItem,
  toTreasuryProposalListItem,
} from "utils/viewfuncs";

export default withLoginUserRedux(({ overview, loginUser, chain }) => {
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

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
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
    },
  };
});
