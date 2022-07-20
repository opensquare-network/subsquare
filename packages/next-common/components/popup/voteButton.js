import React from "react";
import { VoteLoadingEnum } from "../../utils/voteEnum";

import Button from "../button";
import { ButtonWrapper } from "./styled";

export default function VoteButton({ loadingButton, doVote }) {
  return (
    <ButtonWrapper>
      <Button
        primary
        background="#4CAF50"
        onClick={() => doVote(true)}
        isLoading={loadingButton === VoteLoadingEnum.Aye}
        disabled={loadingButton === VoteLoadingEnum.Nay}
      >
        Aye
      </Button>
      <Button
        primary
        background="#F44336"
        onClick={() => doVote(false)}
        isLoading={loadingButton === VoteLoadingEnum.Nay}
        disabled={loadingButton === VoteLoadingEnum.Aye}
      >
        Nay
      </Button>
    </ButtonWrapper>
  );
}
