import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { omit } from "lodash-es";
import { isSameAddress } from "next-common/utils";

function completeSplitVotes(votes) {
  const splitVotes = [...votes];

  if (!splitVotes.find((vote) => vote.aye)) {
    splitVotes.push({
      ...splitVotes[0],
      balance: 0,
      aye: true,
    });
  }
  if (!splitVotes.find((vote) => !vote.aye)) {
    splitVotes.push({
      ...splitVotes[0],
      balance: 0,
      aye: false,
    });
  }

  return splitVotes;
}

function completeSplitAbstainVotes(votes) {
  const splitAbstainVotes = [...votes];

  if (!splitAbstainVotes.find((vote) => vote.isAbstain)) {
    splitAbstainVotes.push({
      ...omit(splitAbstainVotes[0], ["aye", "isAbstain"]),
      balance: 0,
      isAbstain: true,
    });
  }
  if (!splitAbstainVotes.find((vote) => !vote.isAbstain && vote.aye)) {
    splitAbstainVotes.push({
      ...omit(splitAbstainVotes[0], ["aye", "isAbstain"]),
      balance: 0,
      aye: true,
    });
  }
  if (!splitAbstainVotes.find((vote) => !vote.isAbstain && !vote.aye)) {
    splitAbstainVotes.push({
      ...omit(splitAbstainVotes[0], ["aye", "isAbstain"]),
      balance: 0,
      aye: false,
    });
  }

  return splitAbstainVotes;
}

export default function useMyVotes(allVotes) {
  const realAddress = useRealAddress();
  if (!realAddress) {
    return [];
  }

  let votes = allVotes?.filter((item) =>
    isSameAddress(item.account, realAddress),
  );
  if (!votes || votes.length === 0) {
    return [];
  }

  if (votes[0].isSplit) {
    votes = completeSplitVotes(votes);
  } else if (votes[0].isSplitAbstain) {
    votes = completeSplitAbstainVotes(votes);
  }

  votes.sort((a, b) => {
    let priorA = a.isAbstain ? 3 : a.aye ? 1 : 2;
    let priorB = b.isAbstain ? 3 : b.aye ? 1 : 2;
    return priorA - priorB;
  });

  return votes;
}
