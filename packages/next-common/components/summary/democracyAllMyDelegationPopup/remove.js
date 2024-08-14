import RemoveButton from "next-common/components/removeButton";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";

const UndelegatePopup = dynamicPopup(() =>
  import("../delegation/undelegatePopup"),
);

export default function RemoveDelegation({ trackId }) {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Tooltip content={"Remove"}>
        <RemoveButton disabled={isLoading} onClick={() => setShowPopup(true)} />
      </Tooltip>
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
