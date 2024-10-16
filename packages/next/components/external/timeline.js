import { getTimelineStatus } from "utils/index";
import Timeline from "next-common/components/timeline";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useTimelineData } from "next-common/context/post";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useEffect, useState } from "react";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";

function makeSingleExternalTimelineData(args, method) {
  switch (method) {
    case "fastTrack":
      if (Array.isArray(args)) {
        return {
          proposalHash: args.find((arg) =>
            ["proposal_hash", "proposalHash"].includes(arg.name),
          ).value,
          votingPeriod:
            args.find((arg) =>
              ["voting_period", "votingPeriod"].includes(arg.name),
            ).value + " blocks",
          delay: args.find((arg) => arg.name === "delay").value + " blocks",
        };
      }
  }
  return args;
}

export function makeExternalTimelineData(timeline) {
  return (timeline || []).map((item) => {
    return {
      time: formatTime(item.indexer.blockTime),
      indexer: item.indexer,
      status: getTimelineStatus(
        detailPageCategory.DEMOCRACY_EXTERNAL,
        item.method ?? item.name,
      ),
      data: makeSingleExternalTimelineData(item.args, item.method ?? item.name),
    };
  });
}

export default function ExternalTimeline() {
  const timeline = useTimelineData();
  const [timelineData, setTimelineData] = useState([]);
  useEffect(
    () => setTimelineData(makeExternalTimelineData(timeline)),
    [timeline],
  );

  const isTimelineCompact = useIsTimelineCompact();

  return <Timeline data={timelineData} compact={isTimelineCompact} />;
}
