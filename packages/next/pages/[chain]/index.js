import Layout from "components/layout";

import Overview from "components/overview";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { addressEllipsis } from "../../utils";

export default withLoginUserRedux(({ OverviewData, loginUser, chain }) => {
  OverviewData.forEach((list) => {
    if (list.category === "Discussions") {
      list.items.forEach((post) => {
        post.time = post.lastActivityAt;
      });
    }
    if (list.category === "Tips") {
      list.items.forEach((tip) => {
        tip.author = tip.author ?? {
          username: addressEllipsis(tip.finder),
          addresses: [{chain, address: tip.finder}],
        };
        tip.status =  tip.state ?? "Unknown";
        tip.time = tip.indexer.blockTime;

      });
    }
    if (list.category === "Proposals") {
      list.items.forEach((p) => {
        p.author = p.author ?? {
          username: addressEllipsis(p.proposer),
          addresses: [{chain, address: p.proposer}],
        };
        p.status = p.state ?? "Unknown";
        p.time = p.indexer.blockTime;
      });
    }
  });

  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <Overview OverviewData={OverviewData} chain={chain} />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain } = context.query;

  const page = 1;
  const pageSize = 3;

  const [{ result: discussions }, { result: tips }, { result: proposals }] =
    await Promise.all([
      nextApi.fetch(`${chain}/posts`, { page, pageSize }),
      nextApi.fetch(`${chain}/tips`, { page, pageSize }),
      nextApi.fetch(`${chain}/proposals`, { page, pageSize }),
    ]);

  return {
    props: {
      chain,
      OverviewData: [
        {
          category: "Discussions",
          items: discussions?.items ?? [],
        },
        {
          category: "Tips",
          items: tips?.items ?? [],
        },
        {
          category: "Proposals",
          items: proposals?.items ?? [],
        },
      ],
    },
  };
});
