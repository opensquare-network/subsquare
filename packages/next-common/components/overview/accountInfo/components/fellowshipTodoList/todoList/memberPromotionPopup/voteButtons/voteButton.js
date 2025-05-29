import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubFellowshipReferendum from "next-common/hooks/collectives/useSubFellowshipReferendum";
import Tooltip from "next-common/components/tooltip";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import { isNil, noop } from "lodash-es";

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
  const rank = useFellowshipMemberRank(realAddress, collectivePallet);
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

  let disabled = false;
  let tooltipContent = voteAye ? "Vote Aye" : "Vote Nay";
  if (!isReferendumInfoLoading && referendumInfo) {
    try {
      const track = referendumInfo.unwrap()?.asOngoing?.track;
      if (!isNil(track)) {
        const requiredRank = getMinRankOfClass(track, collectivePallet);
        disabled = requiredRank > rank;
        if (disabled) {
          tooltipContent = `Only members with rank >= ${requiredRank} can vote`;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Tooltip content={tooltipContent}>
      <ButtonComponent disabled={disabled} onClick={doSubmitVote}>
        {children}
      </ButtonComponent>
    </Tooltip>
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
