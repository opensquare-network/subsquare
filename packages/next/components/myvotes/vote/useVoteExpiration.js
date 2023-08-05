import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";

const noLockObj = {
  hasLock: false,
};

const noResultObj = {
  hasResult: false,
};

function getReferendaEndInfo(referendumInfo) {
  const { rejected, approved } = referendumInfo;
  if (!rejected && !approved) {
    return noResultObj;
  }

  return {
    hasResult: true,
    approved: !!approved,
    end: (approved || rejected)[0],
  };
}

function getDemocracyEndInfo(referendumInfo) {
  if (!referendumInfo.finished) {
    return noResultObj;
  }

  return {
    hasResult: true,
    approved: referendumInfo.approved,
    end: referendumInfo.end,
  };
}

function getVoteEndInfo(referendumInfo, isReferenda) {
  if (isReferenda) {
    return getReferendaEndInfo(referendumInfo);
  } else {
    return getDemocracyEndInfo(referendumInfo);
  }
}

export default function useVoteExpiration(voteItem) {
  const { vote, referendumInfo } = voteItem;
  const isReferenda = useIsReferenda();
  const [period, setPeriod] = useState();
  const api = useApi();

  useEffect(() => {
    const pallet = isReferenda ? "convictionVoting" : "democracy";
    if (api) {
      setPeriod(api.consts?.[pallet]?.voteLockingPeriod.toNumber());
    }
  }, [api, isReferenda]);

  if (!vote.isStandard) {
    return noLockObj;
  }

  const voteEndInfo = getVoteEndInfo(referendumInfo, isReferenda);
  if (!voteEndInfo.hasResult) {
    return noLockObj;
  }

  const standard = vote.asStandard;
  const aye = standard.vote.isAye;
  if (voteEndInfo.approved !== aye) {
    return noLockObj;
  }

  if (!period) {
    return {
      hasLock: true,
    };
  }

  const conviction = standard.vote.conviction.toNumber();
  const lockEnd = voteEndInfo.end + conviction * period;

  return {
    hasLock: true,
    period,
    voteEnd: voteEndInfo.end,
    lockEnd,
  };
}
