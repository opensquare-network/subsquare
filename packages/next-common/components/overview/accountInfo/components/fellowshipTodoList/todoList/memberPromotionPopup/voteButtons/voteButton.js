import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubFellowshipReferendum from "next-common/hooks/collectives/useSubFellowshipReferendum";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import { isNil, noop } from "lodash-es";
import WatchOnlyTooltip from "next-common/components/watchOnly/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";

function VoteButtonImpl({
  referendumIndex,
  voteAye,
  children,
  ButtonComponent = SecondaryButton,
  callbacks,
}) {
  const api = useContextApi();
  const collectivePallet = useRankedCollectivePallet();
  const realAddress = useRealAddress();
  const isWatchOnly = useIsWatchOnly();
  const { rank: myRank, isLoading: isMyRankLoading } = useFellowshipMemberRank(
    realAddress,
    collectivePallet,
  );
  const { result: referendumInfo, loading: isReferendumInfoLoading } =
    useSubFellowshipReferendum(referendumIndex);

  const { onInBlock = noop, onFinalized = noop } = callbacks || {};

  const voteTxFunc = useCallback(() => {
    return api.tx[collectivePallet].vote(referendumIndex, voteAye);
  }, [api, collectivePallet, referendumIndex, voteAye]);

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
    onInBlock,
    onFinalized,
  });

  let tooltipContent = voteAye ? "Vote Aye" : "Vote Nay";

  let disabled = true;
  if (!isMyRankLoading && !isReferendumInfoLoading && referendumInfo) {
    try {
      const referendum = referendumInfo.unwrap();
      if (referendum?.isOngoing) {
        const track = referendum?.asOngoing?.track;
        if (!isNil(track)) {
          const requiredRank = getMinRankOfClass(track, collectivePallet);
          disabled = requiredRank > myRank;
          if (disabled) {
            tooltipContent = `Only members with rank >= ${requiredRank} can vote`;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <WatchOnlyTooltip content={tooltipContent}>
      <ButtonComponent
        disabled={disabled || isWatchOnly}
        onClick={doSubmitVote}
      >
        {children}
      </ButtonComponent>
    </WatchOnlyTooltip>
  );
}

export default function VoteButton({ children, ...props }) {
  const ButtonComponent = props.ButtonComponent || SecondaryButton;
  return (
    <SignerPopupWrapper loadingContent={<ButtonComponent disabled={true} />}>
      <VoteButtonImpl {...props}>{children}</VoteButtonImpl>
    </SignerPopupWrapper>
  );
}
