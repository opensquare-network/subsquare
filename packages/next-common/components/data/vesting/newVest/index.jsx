import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";

const Popup = dynamicPopup(() => import("./popup"));

export default function NewVest() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="inline-flex ml-2">
        <PrimaryButton size="small" onClick={() => setShowPopup(true)}>
          Vested Transfer
        </PrimaryButton>
      </div>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </>
  );
}
