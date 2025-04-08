import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { cn } from "next-common/utils";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

function VoteButtonImpl({ referendumIndex, voteAye, disabled, children }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const collectivePallet = useRankedCollectivePallet();

  const voteTxFunc = useCallback(() => {
    return api.tx[collectivePallet].vote(referendumIndex, voteAye);
  }, [api, collectivePallet, referendumIndex, voteAye]);

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
    },
  });

  return (
    <SecondaryButton
      disabled={disabled}
      className={cn("p-[6px]", disabled && "[&_svg_path]:stroke-textDisabled")}
      size="small"
      onClick={doSubmitVote}
    >
      {children}
    </SecondaryButton>
  );
}

export default function VoteButton({ children, ...props }) {
  return (
    <SignerPopupWrapper>
      <VoteButtonImpl {...props}>{children}</VoteButtonImpl>
    </SignerPopupWrapper>
  );
}
