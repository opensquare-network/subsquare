import { useState } from "react";
import { Button } from "./styled";

import dynamicPopup from "next-common/lib/dynamic/popup";

const NestedVotesPopup = dynamicPopup(() => import("./nestedVotesPopup"));

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);

  return (
    <>
      <Button onClick={() => setShowNestedVotes(true)}>Nested</Button>

      {showNestedVotes && (
        <NestedVotesPopup setShowVoteList={setShowNestedVotes} />
      )}
    </>
  );
}
