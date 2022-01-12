import dayjs from "dayjs";

export function createMotionTimelineData(motion = {}) {
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
            args: proposal.args,
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
          status: { value: item.method, color: "#6848FF" },
          method: item.method,
        };
      }
    }
  });
}
