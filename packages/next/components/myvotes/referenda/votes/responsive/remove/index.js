import { useState } from "react";
import RemoveButton from "next-common/components/removeButton";
import ReferendumRemovalPopup from "./popup";
import MoonReferendumRemovalPopup from "./moonPopup";
import { useDispatch } from "react-redux";
import { incMyReferendaVotesTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";

export default function RemoveVoteButton({ vote }) {
  const [showPop, setShowPop] = useState(false);
  const dispatch = useDispatch();
  const isUseMetamask = useIsUseMetamask();

  console.log(111);

  let Popup = ReferendumRemovalPopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonReferendumRemovalPopup;
  }

  return (
    <>
      <RemoveButton onClick={() => setShowPop(true)} />
      {showPop && (
        <Popup
          vote={vote}
          onClose={() => setShowPop(false)}
          onInBlock={() => dispatch(incMyReferendaVotesTrigger())}
        />
      )}
    </>
  );
}
