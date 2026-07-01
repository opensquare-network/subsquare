"use client";

import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import SlashAttemptDialog from "./slashAttemptDialog";

export default function SlashButton({ friendGroupIndex, onSlash }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <SlashAttemptDialog
          onClose={() => setShowDialog(false)}
          friendGroupIndex={friendGroupIndex}
          onInBlock={onSlash}
        />
      )}
      <Tooltip content="Slash a malicious recovery attempt">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Slash
        </button>
      </Tooltip>
    </>
  );
}
