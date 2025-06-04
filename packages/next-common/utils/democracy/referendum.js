export const referendumVoteFinishedStatusArray = [
  "Passed",
  "NotPassed",
  "Cancelled",
  "Canceled",
  "Removed",
];

export default function extractVoteInfo(timeline = []) {
  const timelineStatuses = timeline.map((item) => item.method);
  const index = timelineStatuses.findIndex((status) =>
    referendumVoteFinishedStatusArray.includes(status),
  );
  const voteFinished = index >= 0;
  let voteFinishedIndexer = null;
  if (voteFinished) {
    voteFinishedIndexer = timeline[index].indexer;
  }

  return {
    voteFinished,
    voteFinishedIndexer,
    voteFinishedHeight: voteFinishedIndexer?.blockHeight || null,
  };
}
