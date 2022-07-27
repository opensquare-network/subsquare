import React from "react";
import { VoteLoadingEnum } from "../../utils/voteEnum";
import { ButtonWrapper } from "./styled";
import { NegativeButton, PositiveButton } from "../buttons/colorButton";

export default function VoteButton({ loadingState, doVote }) {
  return (
    <ButtonWrapper>
      <PositiveButton
        onClick={() => doVote(true)}
        isLoading={loadingState === VoteLoadingEnum.Aye}
        disabled={loadingState === VoteLoadingEnum.Nay}
      >
        Aye
      </PositiveButton>
      <NegativeButton
        onClick={() => doVote(false)}
        isLoading={loadingState === VoteLoadingEnum.Nay}
        disabled={loadingState === VoteLoadingEnum.Aye}
      >
        Nay
      </NegativeButton>
    </ButtonWrapper>
  );
}
