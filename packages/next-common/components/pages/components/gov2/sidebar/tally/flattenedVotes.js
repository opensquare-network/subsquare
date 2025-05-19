import { useState } from "react";
import { Button } from "./styled";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FlattenedVotesPopup = dynamicPopup(() => import("./flattenedVotesPopup"));

export default function FlattenedVotes() {
  const [showFlattenedVotes, setShowFlattenedVotes] = useState(false);

  return (
    <>
      <Button onClick={() => setShowFlattenedVotes(true)}>Flattened</Button>
      {showFlattenedVotes && (
        <FlattenedVotesPopup setShowVoteList={setShowFlattenedVotes} />
      )}
    </>
  );
}
