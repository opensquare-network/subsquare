import { useState } from "react";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import ReferendaToVotePopup from "../popup/ReferendaToVotePopup";

export default function ReferendaTodo({
  countOfTotalReferenda = 0,
  countOfEligibleReferenda = 0,
  referendaToVote = [],
  referendaVotes = [],
}) {
  const [showReferendaToVotePopup, setShowReferendaToVotePopup] =
    useState(false);

  if (!referendaToVote || referendaToVote.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Referenda</TodoTag>
        <div className="text-textPrimary text14Medium">
          <a
            className="text-theme500 cursor-pointer"
            target="_blank"
            rel="noreferrer"
            href="https://collectives.subsquare.io/fellowship"
          >
            {countOfTotalReferenda} referenda
          </a>{" "}
          are active, you are eligible to vote in {countOfEligibleReferenda} of
          them, and you haven’t vote for{" "}
          <ClickableText onClick={() => setShowReferendaToVotePopup(true)}>
            {referendaToVote?.length} referenda
          </ClickableText>{" "}
          yet
        </div>
      </div>
      {showReferendaToVotePopup && (
        <ReferendaToVotePopup
          referendaToVote={referendaToVote}
          referendaVotes={referendaVotes}
          onClose={() => {
            setShowReferendaToVotePopup(false);
          }}
        />
      )}
    </>
  );
}
