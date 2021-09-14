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
  (OverviewData || []).forEach((list) => {
    if (list.category === "Discussions") {
      list.items.forEach((post) => {
        post.time = post.lastActivityAt;
      });
    }
    if (
      list.category === "On-chain Motions" ||
      (list.category === "Proposals" && list.type === "techcomm")
    ) {
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
    if (list.category === "Externals") {
      list.items.forEach((external) => {
        external.author = external.author ?? {
          username: addressEllipsis(external.proposer),
          addresses: [{ chain, address: external.proposer }],
        };
        external.hash = external.externalProposalHash;
        external.status = external.state ?? "Unknown";
      });
    }
    if (list.category === "Referenda") {
      list.items.forEach((item) => {
        item.status = item.state;
        item.index = item.referendumIndex;
        item.author = post.author ?? {
          username: addressEllipsis(post.proposer),
          addresses: [{ chain, address: post.proposer }],
        };
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

  const { result } = await nextApi.fetch(`${chain}/overview`);

  return {
    props: {
      chain,
      OverviewData: [
        {
          category: "Discussions",
          items: result?.discussions ?? [],
        },
        {
          category: "Tips",
          items: result?.treasury?.tips ?? [],
        },
        {
          category: "Proposals",
          type: "treasury",
          items: result?.treasury?.proposals ?? [],
        },
        {
          category: "On-chain Motions",
          items: result?.council?.motions ?? [],
        },
        {
          category: "Proposals",
          type: "democracy",
          items: result?.democracy?.proposals ?? [],
        },
        {
          category: "Externals",
          items: result?.democracy?.externals ?? [],
        },
        {
          category: "Referenda",
          items: result?.democracy?.referensums ?? [],
        },
        {
          category: "Proposals",
          type: "techcomm",
          items: result?.techComm?.motions ?? [],
        },
      ],
    },
  };
});
