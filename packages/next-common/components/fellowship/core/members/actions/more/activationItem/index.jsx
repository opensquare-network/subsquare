import SignalIndicator from "next-common/components/icons/signalIndicator";
import { useState } from "react";
import ActivationPopup from "./popup";

export default function ActivationItem({ member, rootRef }) {
  const { isActive } = member.status;
  const [showPopup, setShowPopup] = useState(false);

  const targetActiveValue = !isActive;

  return (
    <>
      <div
        className="flex items-center grow"
        role="button"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <SignalIndicator
          showTooltip={false}
          active={targetActiveValue}
          className="w-6 h-6 mr-2"
        />
        {isActive ? "Inactive" : "Active"}
      </div>

      {showPopup && (
        <ActivationPopup
          container={rootRef?.current}
          who={member.address}
          targetActiveValue={targetActiveValue}
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
