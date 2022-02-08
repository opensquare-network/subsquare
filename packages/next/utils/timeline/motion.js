import dayjs from "dayjs";
import User from "next-common/components/user";

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

export function createMotionTimelineData(motion = {}, chain) {
  const { proposer, proposal, voting, timeline = [] } = motion;

  return timeline.map((item) => {
    switch (item.method) {
      case "Proposed": {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: `Motion #${motion.index}`, color: "#6848FF" },
          voting: {
            proposer: proposer,
            method: proposal.method,
            args: createArgs(proposal.method, proposal.args, chain),
            total: voting.threshold,
            ayes: voting.ayes.length,
            nays: voting.nays.length,
          },
          method: item.method,
        };
      }
      case "Voted": {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: "Vote", color: "#6848FF" },
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
          status: { value: item.method },
          method: item.method,
        };
      }
    }
  });
}
