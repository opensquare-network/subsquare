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
          proposalHash: args.find((arg) =>
            ["proposal_hash", "proposalHash"].includes(arg.name)
          ).value,
          votingPeriod:
            args.find((arg) =>
              ["voting_period", "votingPeriod"].includes(arg.name)
            ).value + ` blocks`,
          delay: args.find((arg) => arg.name === "delay").value + ` blocks`,
        };
      }
  }
  return args;
}
