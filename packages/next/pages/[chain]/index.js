import Overview from "components/overview";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { addressEllipsis } from "../../utils";
import LayoutFixedHeader from "../../components/layoutFixedHeader";

export default withLoginUserRedux(({ OverviewData, loginUser, chain }) => {
  function getMotionType(motion) {
    return motion.isTreasury ? "Treasury" : "";
  }
  OverviewData.forEach((list) => {
    if (list.category === "Discussions") {
      list.items.forEach((post) => {
        post.time = post.lastActivityAt;
      });
    }
    if (list.category === "Motions") {
      list.items.forEach((motion) => {
        motion.time = motion.indexer.blockTime;
        motion.title = `${motion.proposal.section}.${motion.proposal.method}`;
        motion.type = getMotionType(motion);
        motion.author = motion.author ?? {
          username: addressEllipsis(motion.proposer),
          addresses: [{ chain, address: motion.proposer }],
        };
        motion.status = motion.state?.state ?? "Unknown";
      });
    }
    if (list.category === "Tips") {
      list.items.forEach((tip) => {
        tip.author = tip.author ?? {
          username: addressEllipsis(tip.finder),
          addresses: [{ chain, address: tip.finder }],
        };
        tip.status = tip.state
          ? tip.state.state === "Tipping"
            ? `Tipping (${tip.state.tipsCount})`
            : tip.state.state
          : "Unknown";
        tip.time = tip.indexer.blockTime;
      });
    }
    if (list.category.includes("Proposals")) {
      list.items.forEach((p) => {
        p.author = p.author ?? {
          username: addressEllipsis(p.proposer),
          addresses: [{ chain, address: p.proposer }],
        };
        p.status = p.state ?? "Unknown";
        p.time = p.indexer.blockTime;
      });
    }
  });

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <Overview OverviewData={OverviewData} chain={chain} />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain } = context.query;

  const page = 1;
  const pageSize = 3;

  const [
    { result: discussions },
    { result: tips },
    { result: motions },
    { result: treasuryProposals },
    { result: democracyProposals },
  ] = await Promise.all([
    nextApi.fetch(`${chain}/posts`, { page, pageSize }),
    nextApi.fetch(`${chain}/treasury/tips`, { page, pageSize }),
    nextApi.fetch(`${chain}/motions`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
    nextApi.fetch(`${chain}/treasury/proposals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
    nextApi.fetch(`${chain}/democracy/proposals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
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
          category: "Motions",
          items: motions?.items ?? [],
        },
        {
          category: "TreasuryProposals",
          items: treasuryProposals?.items ?? [],
        },
        {
          category: "DemocracyProposals",
          items: democracyProposals?.items ?? [],
        },
      ],
    },
  };
});
