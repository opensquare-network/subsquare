import RemoveButton from "next-common/components/removeButton";
import { useState } from "react";
import RemoveReferendumVotePopup from "./removeReferendumVotePopup";
import { useDispatch } from "react-redux";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";

export default function RemoveVoteButton({ vote, isGov2 }) {
  const dispatch = useDispatch();
  const [removeReferendum, setRemoveReferendum] = useState();

  return (
    <>
      <RemoveButton onClick={() => setRemoveReferendum(vote)} />
      {removeReferendum && (
        <RemoveReferendumVotePopup
          isGov2={isGov2}
          votes={[vote]}
          onClose={() => setRemoveReferendum()}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}
