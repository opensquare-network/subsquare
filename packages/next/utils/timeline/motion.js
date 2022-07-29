import dayjs from "dayjs";
import User from "next-common/components/user";
import businessCategory from "next-common/utils/consts/business/category";

export function createArgs(method, args, chain) {
  switch (method) {
    case "proposeCurator": {
      const [bountyId, curator] = args;
      return [
        {
          name: "bountyIndex",
          value: bountyId.value,
        },
        {
          name: curator.name,
          value: <User chain={chain} add={curator.value.id} fontSize={14} />,
        },
      ];
    }
    default:
      return [];
  }
}

export function createMotionTimelineData(
  motion = {},
  chain,
  linkable = false,
  linkPrefix = ""
) {
  const {
    indexer,
    hash,
    proposer,
    proposal,
    voting,
    tally,
    threshold,
    timeline = [],
  } = motion;

  const type = businessCategory.collective;

  return timeline.map((item) => {
    switch (item.method) {
      case "Proposed": {
        const urlSuffix = `${indexer.blockHeight}_${hash}`;
        let link;
        if (linkable) {
          link = [linkPrefix, urlSuffix].join("/");
        }

        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: {
            value: linkable ? `Motion #${motion.index}` : "Proposed",
            link,
            type,
          },
          voting: {
            proposer: proposer,
            method: proposal.method,
            args: createArgs(proposal.method, proposal.args, chain),
            total: threshold || voting?.threshold,
            ayes: tally?.yesVotes || (voting?.ayes || []).length,
            nays: tally?.noVotes || (voting?.nays || []).length,
          },
          method: item.method,
        };
      }
      case "Voted": {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: "Vote", type },
          voteResult: {
            name: item.args.voter,
            value: item.args.approve,
          },
          method: item.method,
        };
      }
      default: {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: item.method, type },
          method: item.method,
        };
      }
    }
  });
}
