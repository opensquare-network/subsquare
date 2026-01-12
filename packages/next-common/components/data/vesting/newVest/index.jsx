import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const Popup = dynamicPopup(() => import("./popup"));

export default function NewVest() {
  const [showPopup, setShowPopup] = useState(false);
  const realAddress = useRealAddress();
  if (!realAddress) {
    return null;
  }

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
