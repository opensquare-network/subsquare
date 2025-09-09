import BountyAppendMenuItem from "next-common/components/appendants/bounty/appendMenuItem";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BountyCreateAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/bounty/createPopup"),
);

export default function AppendBountyMenu({ setShow }) {
  const [showBountyCreatePopup, setShowBountyCreatePopup] = useState(false);

  return (
    <div>
      <BountyAppendMenuItem
        setShow={setShow}
        setIsAppend={setShowBountyCreatePopup}
      />
      {showBountyCreatePopup && (
        <BountyCreateAppendantPopup setIsAppend={setShowBountyCreatePopup} />
      )}
    </div>
  );
}
