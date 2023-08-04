import { SystemClose } from "@osn/icons/subsquare";
import { useState } from "react";
import RemoveReferendumVotePopup from "./removeReferendumVotePopup";

export default function RemoveAllExpiredButton({ votes, isGov2 }) {
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  return (
    <>
      <div
        className="flex cursor-pointer bg-neutral100 rounded-[4px] border border-neutral400 text-[12px] items-center pr-[12px]"
        onClick={() => setShowRemovePopup(true)}
      >
        <SystemClose width={16} height={16} className="m-[6px]" />
        <span>Remove All Expired</span>
      </div>
      {showRemovePopup && (
        <RemoveReferendumVotePopup
          isGov2={isGov2}
          votes={votes}
          onClose={() => setShowRemovePopup(false)}
        />
      )}
    </>
  );
}
