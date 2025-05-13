import businessCategory from "next-common/utils/consts/business/category";
import TimelineReferendumVote from "components/timelineReferendumVote";
import formatTime from "next-common/utils/viewfuncs/formatDate";

// used in treasury proposal timeline
export function createReferendumTimelineData(
  referendum = {},
  linkable = false,
  linkPrefix = "",
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
          time: formatTime(item.indexer.blockTime),
          status: {
            value: linkable ? `Referendum #${referendumIndex}` : "Started",
            link,
            type: businessCategory.collective,
          },
          method: item.method,
          data: <TimelineReferendumVote referendum={referendum} />,
        };
      }
      default: {
        return {
          indexer: item.indexer,
          referendumIndex: referendum.referendumIndex,
          time: formatTime(item.indexer.blockTime),
          status: {
            value: item.method,
            type: businessCategory.democracyReferenda,
          },
          method: item.method,
        };
      }
    }
  });
}
