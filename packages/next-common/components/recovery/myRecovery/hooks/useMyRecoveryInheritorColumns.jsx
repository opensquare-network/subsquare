"use client";

import { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { inheritorColumns } from "next-common/components/recovery/common/columns";
import RevokeInheritorDialog from "../revokeInheritorDialog";

function RevokeButton({ onRevoke, inheritor }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <RevokeInheritorDialog
          inheritor={inheritor}
          onClose={() => setShowDialog(false)}
          onInBlock={onRevoke}
        />
      )}
      <Tooltip content="Revoke the inheritor access">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Revoke
        </button>
      </Tooltip>
    </>
  );
}

function MyInheritorActions({ onRevoke, inheritor }) {
  return <RevokeButton onRevoke={onRevoke} inheritor={inheritor} />;
}

export default function useMyRecoveryInheritorColumns(onRevoke) {
  return useMemo(() => {
    const desktopColumns = [
      inheritorColumns.inheritor("min-w-[200px] text-left"),
      inheritorColumns.priority("w-[120px] text-left"),
      inheritorColumns.depositor("min-w-[200px] text-left"),
      inheritorColumns.deposit("w-[180px] text-left"),
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => (
          <MyInheritorActions onRevoke={onRevoke} inheritor={item} />
        ),
      },
    ];

    const mobileColumns = [
      inheritorColumns.inheritor("text-left"),
      inheritorColumns.priority("text-right"),
      inheritorColumns.depositor("text-left"),
      inheritorColumns.deposit("text-right"),
      {
        name: "Action",
        className: "text-left",
        render: (item) => (
          <MyInheritorActions onRevoke={onRevoke} inheritor={item} />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onRevoke]);
}
