import RemoveButton from "next-common/components/removeButton";
import UndelegatePopup from "../delegation/undelegatePopup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";

export default function RemoveDelegation({ trackId }) {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <RemoveButton onClick={() => setShowPopup(true)} />
      {showPopup && (
        <UndelegatePopup
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
