import Overview from "components/overview";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { addressEllipsis } from "../../utils";
import LayoutFixedHeader from "../../components/layoutFixedHeader";

function getMotionType(motion) {
  return motion.isTreasury ? "Treasury" : "";
}

export default withLoginUserRedux(({ overview, loginUser, chain }) => {
  const overviewData = [
    {
      category: "Discussions",
      type: "discussion",
      items: (overview?.discussions ?? []).map(item => ({
        ...item,
        time: item.lastActivityAt,
      })),
    },
    {
      category: "Tips",
      type: "treasury",
      items: (overview?.treasury?.tips ?? []).map(item => ({
        ...item,
        author: item.author ?? {
          username: addressEllipsis(item.finder),
          addresses: [{ chain, address: item.finder }],
        },
        status: item.state
          ? item.state.state === "Tipping"
            ? `Tipping (${item.state.tipsCount})`
            : item.state.state
          : "Unknown",
        time: item.indexer.blockTime,

      })),
    },
    {
      category: "Treasury Proposals",
      type: "treasury",
      items: (overview?.treasury?.proposals ?? []).map(item => ({
        ...item,
        author: item.author ?? {
          username: addressEllipsis(item.proposer),
          addresses: [{ chain, address: item.proposer }],
        },
        status: item.state ?? "Unknown",
        time: item.indexer.blockTime,
      })),
    },
    {
      category: "Council Motions",
      type: "council",
      items: (overview?.council?.motions ?? []).map(item => ({
        ...item,
        time: item.indexer.blockTime,
        title: `${item.proposal.section}.${item.proposal.method}`,
        type: getMotionType(item),
        author: item.author ?? {
          username: addressEllipsis(item.proposer),
          addresses: [{ chain, address: item.proposer }],
        },
        status: item.state?.state ?? "Unknown",
      })),
    },
    {
      category: "Public Proposals",
      type: "democracy",
      items: (overview?.democracy?.proposals ?? []).map(item => ({
        ...item,
        author: item.author ?? {
          username: addressEllipsis(item.proposer),
          addresses: [{ chain, address: item.proposer }],
        },
        status: item.state ?? "Unknown",
        time: item.indexer.blockTime,

      })),
    },
    {
      category: "External Proposals",
      type: "democracy",
      items: (overview?.democracy?.externals ?? []).map(item => ({
        ...item,
        author: item.author ?? {
          username: addressEllipsis(item.proposer),
          addresses: [{ chain, address: item.proposer }],
        },
        hash: item.externalProposalHash,
        status: item.state ?? "Unknown",
      })),
    },
    {
      category: "Referenda",
      type: "democracy",
      items: (overview?.democracy?.referensums ?? []).map(item => ({
        ...item,
        status: item.state,
        index: item.referendumIndex,
        author: item.author ?? {
          username: addressEllipsis(item.proposer),
          addresses: [{ chain, address: item.proposer }],
        },
      })),
    },
    {
      category: "Technical Committee Proposals",
      type: "techcomm",
      items: (overview?.techComm?.motions ?? []).map(item => ({
        ...item,
        time: item.indexer.blockTime,
        title: `${item.proposal.section}.${item.proposal.method}`,
        type: getMotionType(item),
        author: item.author ?? {
          username: addressEllipsis(item.proposer),
          addresses: [{ chain, address: item.proposer }],
        },
        status: item.state?.state ?? "Unknown",
      })),
    },
  ];

  return (
    <LayoutFixedHeader
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <Overview overviewData={overviewData} chain={chain} />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain } = context.query;

  const { result } = await nextApi.fetch(`${chain}/overview`);

  return {
    props: {
      chain,
      overview: result ?? null,
    },
  };
});
