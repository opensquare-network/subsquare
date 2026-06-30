"use client";

import { useState } from "react";
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
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Slash
      </button>
    </>
  );
}
