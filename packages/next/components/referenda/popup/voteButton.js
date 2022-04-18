import Button from "next-common/components/button";
import { ButtonWrapper } from "next-common/components/popup/styled";

export default function VoteButton({ isLoading, doVote }) {
  return (
    <ButtonWrapper>
      <Button
        primary
        background="#4CAF50"
        onClick={() => doVote(true)}
        isLoading={isLoading === "Aye"}
        disabled={isLoading && isLoading !== "Aye"}
      >
        Aye
      </Button>
      <Button
        primary
        background="#F44336"
        onClick={() => doVote(false)}
        isLoading={isLoading === "Nay"}
        disabled={isLoading && isLoading !== "Nay"}
      >
        Nay
      </Button>
    </ButtonWrapper>
  );
}
