import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";
const Popup = dynamicPopup(() => import("./popup"));

export default function NewTipButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PrimaryButton
        size="small"
        iconLeft={
          <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
        }
        onClick={() => setShowPopup(true)}
      >
        New Tip
      </PrimaryButton>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </>
  );
}
