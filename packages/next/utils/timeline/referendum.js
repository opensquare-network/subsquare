import dayjs from "dayjs";
import businessCategory from "next-common/utils/consts/business/category";
import TimelineReferendumVote from "components/timelineReferendumVote";

// used in treasury proposal timeline
export function createReferendumTimelineData(
  referendum = {},
  chain,
  linkable = false,
  linkPrefix = ""
) {
  const { referendumIndex, timeline = [] } = referendum;

  return timeline.map((item) => {
    switch (item.method) {
      case "Started": {
        const urlSuffix = `${referendumIndex}`;
        let link;
        if (linkable) {
          link = [linkPrefix, urlSuffix].join("/");
        }

        return {
          indexer: item.indexer,
          referendumIndex: referendumIndex,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: {
            value: linkable ? `Referendum #${referendumIndex}` : "Started",
            link,
            type: businessCategory.collective,
          },
          method: item.method,
          data: (
            <TimelineReferendumVote referendum={referendum} chain={chain} />
          ),
        };
      }
      default: {
        return {
          indexer: item.indexer,
          referendumIndex: referendum.referendumIndex,
          time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
          status: { value: item.method, type: businessCategory.democracyReferenda },
          method: item.method,
        };
      }
    }
  });
}
