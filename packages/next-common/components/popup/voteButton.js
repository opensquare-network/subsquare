import React from "react";
import { VoteLoadingEnum } from "../../utils/voteEnum";
import { ButtonWrapper } from "./styled";
import SuccessButton from "next-common/lib/button/success";
import DangerButton from "next-common/lib/button/danger";

export default function VoteButton({ disabled, loadingState, doVote }) {
  return (
    <ButtonWrapper>
      <DangerButton
        onClick={() => doVote(false)}
        loading={loadingState === VoteLoadingEnum.Nay}
        disabled={disabled || loadingState === VoteLoadingEnum.Aye}
      >
        Nay
      </DangerButton>

      <SuccessButton
        onClick={() => doVote(true)}
        loading={loadingState === VoteLoadingEnum.Aye}
        disabled={disabled || loadingState === VoteLoadingEnum.Nay}
      >
        Aye
      </SuccessButton>
    </ButtonWrapper>
  );
}
