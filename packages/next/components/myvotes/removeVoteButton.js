import RemoveButton from "next-common/components/removeButton";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import RemoveReferendaVotePopup from "./removeReferendaVotePopup";
import RemoveDemocracyVotePopup from "./removeDemocracyVotePopup";

export default function RemoveVoteButton({ vote }) {
  const dispatch = useDispatch();
  const [removeReferendum, setRemoveReferendum] = useState();
  const isReferenda = useIsReferenda();

  const RemoveVotePopup = isReferenda
    ? RemoveReferendaVotePopup
    : RemoveDemocracyVotePopup;

  return (
    <>
      <RemoveButton onClick={() => setRemoveReferendum(vote)} />
      {removeReferendum && (
        <RemoveVotePopup
          votes={[vote]}
          onClose={() => setRemoveReferendum()}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}
