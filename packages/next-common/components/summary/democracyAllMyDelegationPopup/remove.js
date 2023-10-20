import RemoveButton from "next-common/components/removeButton";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import UndelegatePopup from "../delegation/undelegatePopup";
import MoonUndelegatePopup from "../delegation/undelegatePopup/moonPopup";
import Tooltip from "next-common/components/tooltip";

export default function RemoveDelegation({ trackId }) {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let TheUndelegatePopup = UndelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheUndelegatePopup = MoonUndelegatePopup;
  }

  return (
    <>
      <Tooltip content={"Remove"}>
        <RemoveButton disabled={isLoading} onClick={() => setShowPopup(true)} />
      </Tooltip>
      {showPopup && (
        <TheUndelegatePopup
          trackId={trackId}
          onClose={() => setShowPopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onInBlock={() => {
            dispatch(incMyReferendaDelegationsTrigger());
          }}
        />
      )}
    </>
  );
}
