import Overview from "components/overview";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "components/layout";
import {
  toDiscussionListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
} from "utils/viewfuncs";
import { isSafari } from "../utils/serverSideUtil";

export default withLoginUserRedux(({ overview, loginUser, chain }) => {
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
  isSafari(context);
  const { result, error } = await nextApi.fetch(`overview`);

  return {
    props: {
      chain,
      overview: result ?? null,
    },
  };
});
