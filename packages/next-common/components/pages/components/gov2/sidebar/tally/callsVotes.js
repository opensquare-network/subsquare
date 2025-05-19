import { Button } from "./styled";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const OpenGovCallsVotesPopup = dynamicPopup(() =>
  import("./openGovCallsVotesPopup"),
);

export default function CallsVotes() {
  const [showCallsVotes, setShowCallsVotes] = useState(false);

  return (
    <>
      <Tooltip
        contentClassName="max-w-[240px]"
        content="Shows the on-chain transaction that the proposal will execute."
      >
        <Button onClick={() => setShowCallsVotes(true)}>Calls</Button>
      </Tooltip>
      {showCallsVotes && (
        <OpenGovCallsVotesPopup setShowVoteList={setShowCallsVotes} />
      )}
    </>
  );
}
