import { Button } from "./styled";
import { useState } from "react";
import AllVoteExtrinsicsPopup from "../allVoteExtrinsicsPopup";

export default function VoteExtrinsics() {
  const [showVoteExtrinsic, setShowVoteExtrinsic] = useState(false);

  return (
    <>
      <Button onClick={() => setShowVoteExtrinsic(true)}>
        Vote Extrinsics
      </Button>
      {showVoteExtrinsic && (
        <AllVoteExtrinsicsPopup setShowVoteList={setShowVoteExtrinsic} />
      )}
    </>
  );
}
