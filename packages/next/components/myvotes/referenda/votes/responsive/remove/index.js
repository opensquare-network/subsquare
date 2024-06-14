import { useState } from "react";
import RemoveButton from "next-common/components/removeButton";
import { useDispatch } from "react-redux";
import { incMyReferendaVotesTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import dynamic from "next/dynamic";

const ReferendumRemovalPopup = dynamic(() => import("./popup"), {
  ssr: false,
});

const MoonReferendumRemovalPopup = dynamic(() => import("./moonPopup"), {
  ssr: false,
});

export default function RemoveVoteButton({ vote }) {
  const [showPop, setShowPop] = useState(false);
  const dispatch = useDispatch();
  const isUseMetamask = useIsUseMetamask();

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
