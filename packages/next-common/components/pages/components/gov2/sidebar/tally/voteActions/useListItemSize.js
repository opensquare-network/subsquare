import { useMemo } from "react";
import { isDirectVote, isDelegation } from "./common";

function getVoteTypeInfo(item) {
  const preVote = item?.data?.preVote;
  const vote = item?.data?.vote;

  return {
    hasPreVote: !!preVote,
    preVoteIsSplitAbstain: preVote?.isSplitAbstain,
    preVoteIsStandard: preVote?.isStandard,
    preVoteIsSplit: preVote?.isSplit,
    voteIsSplitAbstain: vote?.isSplitAbstain,
    voteIsStandard: vote?.isStandard,
    voteIsSplit: vote?.isSplit,
  };
}

function getDesktopDirectVoteHeight(voteInfo) {
  const {
    hasPreVote,
    preVoteIsSplitAbstain,
    preVoteIsStandard,
    preVoteIsSplit,
    voteIsSplitAbstain,
    voteIsStandard,
    voteIsSplit,
  } = voteInfo;

  if (!hasPreVote) {
    return voteIsSplitAbstain ? 108 : 88;
  }

  if (preVoteIsStandard && voteIsStandard) {
    return 128;
  }

  if (preVoteIsSplitAbstain && voteIsSplitAbstain) {
    return 108;
  }

  if (preVoteIsSplit && voteIsSplit) {
    return 88;
  }

  if (
    preVoteIsStandard === !voteIsStandard &&
    !preVoteIsSplitAbstain &&
    !voteIsSplitAbstain
  ) {
    return 164;
  }

  return 184;
}

function getMobileDirectVoteHeight(voteInfo) {
  const {
    hasPreVote,
    preVoteIsSplitAbstain,
    preVoteIsStandard,
    preVoteIsSplit,
    voteIsSplitAbstain,
    voteIsStandard,
    voteIsSplit,
  } = voteInfo;

  if (!hasPreVote) {
    return voteIsSplitAbstain ? 252 : 228;
  }

  if (preVoteIsStandard && voteIsStandard) {
    return 260;
  }

  if (preVoteIsSplitAbstain && voteIsSplitAbstain) {
    return 336;
  }

  if (preVoteIsSplit && voteIsSplit) {
    return 288;
  }

  if (
    preVoteIsStandard === !voteIsStandard &&
    !preVoteIsSplitAbstain &&
    !voteIsSplitAbstain
  ) {
    return 302;
  }

  return 342;
}

function useItemSize(data, defaultHeight, directVoteCalculator) {
  return useMemo(() => {
    if (!data?.length) {
      return null;
    }

    return (index) => {
      const item = data[index];
      if (!item) {
        return defaultHeight;
      }

      if (isDirectVote(item.type)) {
        const voteInfo = getVoteTypeInfo(item);
        return directVoteCalculator(voteInfo);
      }

      if (isDelegation(item.type) && item?.data?.preDelegation) {
        return directVoteCalculator === getMobileDirectVoteHeight
          ? 244
          : defaultHeight;
      }

      return defaultHeight;
    };
  }, [data, defaultHeight, directVoteCalculator]);
}

export function useDesktopItemSize(data) {
  return useItemSize(data, 72, getDesktopDirectVoteHeight);
}

export function useMobileItemSize(data) {
  return useItemSize(data, 200, getMobileDirectVoteHeight);
}
