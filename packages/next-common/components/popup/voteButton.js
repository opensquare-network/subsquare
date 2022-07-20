import React from "react";
import { VoteLoadingEnum } from "../../utils/voteEnum";

import Button from "../button";
import { ButtonWrapper } from "./styled";

export default function VoteButton({ loadingState, doVote }) {
  return (
    <ButtonWrapper>
      <Button
        primary
        background="#4CAF50"
        onClick={() => doVote(true)}
        isLoading={loadingState === VoteLoadingEnum.Aye}
        disabled={loadingState === VoteLoadingEnum.Nay}
      >
        Aye
      </Button>
      <Button
        primary
        background="#F44336"
        onClick={() => doVote(false)}
        isLoading={loadingState === VoteLoadingEnum.Nay}
        disabled={loadingState === VoteLoadingEnum.Aye}
      >
        Nay
      </Button>
    </ButtonWrapper>
  );
}
