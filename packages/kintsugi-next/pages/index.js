import Overview from "components/overview";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import {
  toDiscussionListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
} from "utils/viewfuncs";
import SEO from "components/SEO";
import { isSafari } from "../utils/serverSideUtil";

export default withLoginUserRedux(({ overview, loginUser, chain, siteUrl }) => {
  let overviewData = [
    {
      category: "Discussions",
      items: (overview?.discussions ?? []).map((item) =>
        toDiscussionListItem(chain, item)
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

  // Sort the items with length = 0 to the end of the list
  overviewData.sort((a, b) =>
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
  isSafari(context);
  const { result } = await nextApi.fetch(`overview`);

  return {
    props: {
      chain,
      overview: result ?? null,
      siteUrl: process.env.SITE_URL,
    },
  };
});
