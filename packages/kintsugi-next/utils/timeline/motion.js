import dayjs from "dayjs";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export function createMotionTimelineData(motion = {}) {
  const { proposer, proposal, voting, timeline = [] } = motion;
  const type = detailPageCategory.TECH_COMM_MOTION;

  return timeline.map((item) => {
    switch (item.method) {
      case "Proposed": {
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: `Motion #${motion.index}`, type },
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
          status: { value: "Vote", type },
          voteResult: {
            name: item.args.voter,
            value: item.args.approve,
          },
          method: item.method,
        };
      }
      default: {
        const methodMap = new Map([
          ["propose", "Proposed"],
          ["FastTrack", "FastTracked"],
        ]);
        const method = methodMap.get(item.method) ?? item.method;
        return {
          indexer: item.indexer,
          hash: motion.hash,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: method, type },
          method,
        };
      }
    }
  });
}
