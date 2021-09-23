import dayjs from "dayjs";
import { getTimelineStatus } from "../index";

export function makeExternalTimelineData(timeline) {
  return (timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus("proposal", item.method ?? item.name),
      data: makeSingleExternalTimelineData(item.args, item.method ?? item.name),
    };
  });
}

export function makeSingleExternalTimelineData(args, method) {
  switch (method) {
    case "fastTrack":
      if (Array.isArray(args)) {
        return {
          proposalHash: args.find((arg) => arg.name === "proposal_hash").value,
          votingPeriod:
            args.find((arg) => arg.name === "voting_period").value + ` blocks`,
          delay: args.find((arg) => arg.name === "delay").value + ` blocks`,
        };
      }
  }
  return args;
}

export function sortByIndexerBlockTime(a, b) {
  let aBlock = Array.isArray(a) ? a[0] : a;
  let bBlock = Array.isArray(b) ? b[0] : b;
  if (
    Number.isInteger(aBlock?.indexer?.blockTime - bBlock?.indexer?.blockTime)
  ) {
    return aBlock.indexer.blockTime - bBlock.indexer.blockTime;
  }
  return 0;
}
