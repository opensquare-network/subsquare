import { useState } from "react";
import RemoveButton from "next-common/components/removeButton";
import { useDispatch } from "react-redux";
import { incMyReferendaVotesTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ReferendumRemovalPopup = dynamicPopup(() => import("./popup"));

export default function RemoveVoteButton({ vote }) {
  const [showPop, setShowPop] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <RemoveButton onClick={() => setShowPop(true)} />
      {showPop && (
        <ReferendumRemovalPopup
          vote={vote}
          onClose={() => setShowPop(false)}
          onInBlock={() => dispatch(incMyReferendaVotesTrigger())}
        />
      )}
    </>
  );
}
