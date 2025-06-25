import { useMemo } from "react";
import { isDirectVote, isDelegation } from "./common";

const HEIGHT_CONFIG = {
  desktop: {
    directVote: {
      noPreVote: {
        standard: 88,
        split: 88,
        splitAbstain: 108,
      },
      withPreVote: {
        standardTostandard: 128,
        splitAbstainTosplitAbstain: 108,
        splitTosplit: 88,
        standardTosplit: 164,
        splitTostandard: 164,
        default: 184,
      },
    },
    delegation: {
      withPreDelegation: 72,
      default: 72,
    },
  },
  mobile: {
    directVote: {
      noPreVote: {
        standard: 228,
        split: 228,
        splitAbstain: 252,
      },
      withPreVote: {
        standardTostandard: 260,
        splitAbstainTosplitAbstain: 336,
        splitTosplit: 288,
        standardTosplit: 302,
        splitTostandard: 302,
        default: 342,
      },
    },
    delegation: {
      withPreDelegation: 244,
      default: 200,
    },
  },
};

function getVoteType(vote) {
  if (vote?.isSplitAbstain) {
    return "splitAbstain";
  }

  if (vote?.isSplit) {
    return "split";
  }

  if (vote?.isStandard) {
    return "standard";
  }

  return null;
}

function getVoteInfo(item) {
  const preVote = item?.data?.preVote;
  const vote = item?.data?.vote;
  return {
    preVoteType: getVoteType(preVote),
    voteType: getVoteType(vote),
  };
}

function getItemHeight(item, deviceType) {
  if (isDirectVote(item.type)) {
    const { preVoteType, voteType } = getVoteInfo(item);
    if (!preVoteType) {
      return (
        HEIGHT_CONFIG[deviceType].directVote.noPreVote[voteType] ||
        HEIGHT_CONFIG[deviceType].directVote.noPreVote.standard
      );
    }
    const key = voteType ? `${preVoteType}To${voteType}` : "default";

    return (
      HEIGHT_CONFIG[deviceType].directVote.withPreVote[key] ||
      HEIGHT_CONFIG[deviceType].directVote.withPreVote.default
    );
  }

  if (isDelegation(item.type) && item?.data?.preDelegation) {
    return HEIGHT_CONFIG[deviceType].delegation.withPreDelegation;
  }

  return HEIGHT_CONFIG[deviceType].delegation.default;
}

function useItemSize(data, deviceType) {
  return useMemo(() => {
    if (!data?.length) {
      return null;
    }

    return (index) => {
      const item = data[index];

      return getItemHeight(item, deviceType);
    };
  }, [data, deviceType]);
}

export function useDesktopItemSize(data) {
  return useItemSize(data, "desktop");
}

export function useMobileItemSize(data) {
  return useItemSize(data, "mobile");
}
