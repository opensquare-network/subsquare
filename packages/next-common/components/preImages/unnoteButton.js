import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const UnnotePopup = dynamicPopup(() => import("./unnotePopup"));

export default function UnnoteButton({ hash, onInBlock }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <span
        className="text-[12px] text-theme500 cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        Unnote
      </span>
      {showPopup && (
        <UnnotePopup
          hash={hash}
          onClose={() => setShowPopup(false)}
          onInBlock={onInBlock}
        />
      )}
    </>
  );
}
