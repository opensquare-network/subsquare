import { SystemPlus } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import NewBountyPopup from "./popup";

export default function NewBountyButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PrimaryButton
        size="small"
        iconLeft={<SystemPlus className="w-4 h-4" />}
        onClick={() => {
          setShowPopup(true);
        }}
      >
        New Bounty
      </PrimaryButton>

      {showPopup && (
        <NewBountyPopup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
