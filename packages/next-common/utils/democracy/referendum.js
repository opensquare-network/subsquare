export const referendumVoteFinishedStatusArray = [
  "Passed",
  "NotPassed",
  "Cancelled",
  "Canceled",
];

export default function extractVoteInfo(timeline = []) {
  const timelineStatuses = timeline.map(item => item.method);
  const index = timelineStatuses.findIndex(status => referendumVoteFinishedStatusArray.includes(status));
  const voteFinished = index >= 0;
  let voteFinishedHeight = null;
  if (voteFinished) {
    voteFinishedHeight = timeline[index].indexer.blockHeight
  }

  return {
    voteFinished,
    voteFinishedHeight,
  }
}
