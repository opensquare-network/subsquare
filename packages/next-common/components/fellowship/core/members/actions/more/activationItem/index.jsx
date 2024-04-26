import SignalIndicator from "next-common/components/icons/signalIndicator";
import { useState } from "react";
import ActivationPopup from "./popup";

export default function ActivationItem({ member }) {
  const { isActive } = member.status;
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div
        className="flex items-center"
        role="button"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <SignalIndicator
          showTooltip={false}
          active={!isActive}
          className="w-6 h-6 mr-2"
        />
        {isActive ? "Inactive" : "Active"}
      </div>

      {showPopup && (
        <ActivationPopup
          who={member.address}
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
