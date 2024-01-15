import React from "react";
import { VoteLoadingEnum } from "../../utils/voteEnum";
import { ButtonWrapper } from "./styled";
import { NegativeButton, PositiveButton } from "../buttons/colorButton";

export default function VoteButton({ disabled, loadingState, doVote }) {
  return (
    <ButtonWrapper>
      <NegativeButton
        onClick={() => doVote(false)}
        isLoading={loadingState === VoteLoadingEnum.Nay}
        disabled={disabled || loadingState === VoteLoadingEnum.Aye}
      >
        Nay
      </NegativeButton>

      <PositiveButton
        onClick={() => doVote(true)}
        isLoading={loadingState === VoteLoadingEnum.Aye}
        disabled={disabled || loadingState === VoteLoadingEnum.Nay}
      >
        Aye
      </PositiveButton>
    </ButtonWrapper>
  );
}
