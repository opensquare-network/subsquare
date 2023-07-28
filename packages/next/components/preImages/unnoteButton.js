import { useState } from "react";
import UnnotePopup from "./unnotePopup";

export default function UnnoteButton({ hash }) {
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
        <UnnotePopup hash={hash} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
