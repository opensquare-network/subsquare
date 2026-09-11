import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

const PurchasePopup = dynamicPopup(() => import("./popup"));

export default function CoretimePurchaseButton() {
  const sale = useCoretimeSale();
  const [showPopup, setShowPopup] = useState(false);

  if (sale?.isFinal) {
    return null;
  }

  return (
    <>
      <PrimaryButton
        type="button"
        size="small"
        className="disabled:pointer-events-none"
        onClick={() => setShowPopup(true)}
      >
        Purchase
      </PrimaryButton>
      {showPopup && <PurchasePopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
