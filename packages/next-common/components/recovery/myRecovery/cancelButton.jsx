"use client";

import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import CancelAttemptDialog from "next-common/components/recovery/helpOthers/cancelAttemptDialog";

export default function CancelButton({
  lostAccount,
  friendGroupIndex,
  onCancel,
}) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <CancelAttemptDialog
          onClose={() => setShowDialog(false)}
          lostAccount={lostAccount}
          friendGroupIndex={friendGroupIndex}
          onInBlock={onCancel}
        />
      )}
      <Tooltip content="Cancel this recovery attempt">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Cancel
        </button>
      </Tooltip>
    </>
  );
}
