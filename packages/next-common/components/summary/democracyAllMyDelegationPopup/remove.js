import RemoveButton from "next-common/components/removeButton";
import UndelegatePopup from "../delegation/undelegatePopup";
import { useState } from "react";

export default function RemoveDelegation({ trackId }) {
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
        />
      )}
    </>
  );
}
