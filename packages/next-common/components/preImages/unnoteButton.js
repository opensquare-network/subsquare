import { useState } from "react";
import dynamic from "next/dynamic";

const UnnotePopup = dynamic(() => import("./unnotePopup"), {
  ssr: false,
});

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
